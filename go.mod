module github.com/qiniu/goplus-www

go 1.12

require (
	cloud.google.com/go v0.58.0
	contrib.go.opencensus.io/exporter/prometheus v0.2.0
	contrib.go.opencensus.io/exporter/stackdriver v0.13.1
	github.com/aws/aws-sdk-go v1.32.5
	github.com/bradfitz/gomemcache v0.0.0-20190913173617-a41fca850d0b
	github.com/google/go-cmp v0.5.0
	github.com/qiniu/goplus v0.6.41-0.20200627014401-a031ebddfa3f
	github.com/shurcooL/webdavfs v0.0.0-20190527155401-0680c3c63e3c
	go.opencensus.io v0.22.4
	golang.org/x/build v0.0.0-20200618235529-3228d3c70d31
	golang.org/x/mod v0.3.0
	golang.org/x/net v0.0.0-20200602114024-627f9648deb9
	golang.org/x/tools v0.0.0-20200619180055-7c47624df98f
	google.golang.org/api v0.28.0
	google.golang.org/genproto v0.0.0-20200619004808-3e7fca5c55db
	grpc.go4.org v0.0.0-20170609214715-11d0a25b4919
)

replace (
	cloud.google.com/go => cloud.google.com/go v0.58.0
	cloud.google.com/go/bigquery => cloud.google.com/go/bigquery v1.8.0
	github.com/golang/protobuf => github.com/golang/protobuf v1.4.2
	golang.org/x/mod => golang.org/x/mod v0.3.0
	golang.org/x/net => golang.org/x/net v0.0.0-20200602114024-627f9648deb9
	golang.org/x/sys => golang.org/x/sys v0.0.0-20200523222454-059865788121
	golang.org/x/tools => golang.org/x/tools v0.0.0-20200619180055-7c47624df98f
	google.golang.org/api => google.golang.org/api v0.28.0
	google.golang.org/genproto => google.golang.org/genproto v0.0.0-20200619004808-3e7fca5c55db
	google.golang.org/grpc => google.golang.org/grpc v1.29.1
)
