// Copyright 2017 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"bytes"
	"context"
	"io/ioutil"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/shurcooL/webdavfs/vfsutil"
	"golang.org/x/net/webdav"
)

type store interface {
	PutSnippet(ctx context.Context, id string, snip *snippet) error
	GetSnippet(ctx context.Context, id string, snip *snippet) error
}

type localStore struct {
	// LocalFS is the local store for snippets. Snippets are kept as files,
	// named after the snippet id (with no extension), in the root directory.
	LocalFS webdav.FileSystem
}

func (s localStore) PutSnippet(ctx context.Context, id string, snip *snippet) error {
	err := vfsutil.WriteFile(ctx, s.LocalFS, id, snip.Body, 0644)
	return err
}

func (s localStore) GetSnippet(ctx context.Context, id string, snip *snippet) error {
	file, err := vfsutil.Open(ctx, s.LocalFS, id)
	if err == nil {
		snip.Body, err = ioutil.ReadAll(file)
	}
	return err
}

func newLocalStore(dir string) store {
	os.Mkdir(dir, 0777)
	return &localStore{webdav.Dir(dir)}
}

func newMemStore() store {
	return &localStore{webdav.NewMemFS()}
}

// s3Storage refers to a common s3 storage
type s3Storage struct {
	endpoint  string
	region    string
	accessKey string
	secretKey string
	bucket    string
}

// s3Session opens a new s3 session.
func (s *s3Storage) s3Session() (*session.Session, error) {
	conf := &aws.Config{
		Region:      aws.String(s.region),
		Endpoint:    aws.String(s.endpoint),
		Credentials: credentials.NewStaticCredentials(s.accessKey, s.secretKey, ""),
	}
	return session.NewSessionWithOptions(session.Options{Config: *conf})
}

// PutSnippet is used as storage snippet.
// duplicate check should be done before put.
// we do not run size check neither.
func (s *s3Storage) PutSnippet(ctx context.Context, id string, snip *snippet) error {
	sess, err := s.s3Session()
	if err != nil {
		return err
	}

	svc := s3.New(sess)
	input := &s3.PutObjectInput{
		Bucket:      &s.bucket,
		Key:         &id,
		Body:        aws.ReadSeekCloser(bytes.NewBuffer(snip.Body)),
		ContentType: aws.String("text/plain"),
	}
	_, err = svc.PutObject(input)
	return err
}

// GetSnippet returns the actual snippet.
func (s *s3Storage) GetSnippet(ctx context.Context, id string, snip *snippet) error {
	sess, err := s.s3Session()
	if err != nil {
		return err
	}

	svc := s3.New(sess)
	input := &s3.GetObjectInput{
		Bucket: &s.bucket,
		Key:    &id,
	}
	result, err := svc.GetObject(input)
	if err != nil {
		return err
	}
	b, _ := ioutil.ReadAll(result.Body)
	defer result.Body.Close()

	*snip = snippet{Body: b}
	return nil
}

// newS3Store is used as a common code snippet storage.
func newS3Store() store {
	s := &s3Storage{}
	s.endpoint = os.Getenv("S3_ENDPOINT")
	s.region = os.Getenv("S3_REGION")
	s.accessKey = os.Getenv("S3_ACCESS_KEY")
	s.secretKey = os.Getenv("S3_SECRET_KEY")
	s.bucket = os.Getenv("S3_BUCKET")
	return s
}
