module github.com/goplus/www

go 1.24.0

require (
	cloud.google.com/go v0.75.0
	contrib.go.opencensus.io/exporter/prometheus v0.3.0
	contrib.go.opencensus.io/exporter/stackdriver v0.13.8
	github.com/aws/aws-sdk-go v1.37.0
	github.com/bradfitz/gomemcache v0.0.0-20190913173617-a41fca850d0b
	github.com/google/go-cmp v0.5.5
	github.com/goplus/mod v0.20.2
	github.com/goplus/xgo v1.7.1-0.20260413043704-93ff1eed8445
	github.com/shurcooL/webdavfs v0.0.0-20190527155401-0680c3c63e3c
	go.opencensus.io v0.23.0
	golang.org/x/mod v0.20.0
	golang.org/x/net v0.50.0
	golang.org/x/tools v0.1.7
	google.golang.org/api v0.37.0
	google.golang.org/genproto v0.0.0-20210126160654-44e461bb6506
)

require (
	github.com/alecthomas/template v0.0.0-20190718012654-fb15b899a751 // indirect
	github.com/alecthomas/units v0.0.0-20190924025748-f65c72e2690d // indirect
	github.com/beorn7/perks v1.0.1 // indirect
	github.com/census-instrumentation/opencensus-proto v0.3.0 // indirect
	github.com/cespare/xxhash/v2 v2.1.1 // indirect
	github.com/golang/groupcache v0.0.0-20200121045136-8c9f03a8e57e // indirect
	github.com/golang/protobuf v1.4.3 // indirect
	github.com/googleapis/gax-go/v2 v2.0.5 // indirect
	github.com/goplus/gogen v1.23.0-pre.2 // indirect
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/jmespath/go-jmespath v0.4.0 // indirect
	github.com/konsorten/go-windows-terminal-sequences v1.0.3 // indirect
	github.com/matttproud/golang_protobuf_extensions v1.0.1 // indirect
	github.com/prometheus/client_golang v1.9.0 // indirect
	github.com/prometheus/client_model v0.2.0 // indirect
	github.com/prometheus/common v0.15.0 // indirect
	github.com/prometheus/procfs v0.2.0 // indirect
	github.com/prometheus/statsd_exporter v0.20.0 // indirect
	github.com/qiniu/x v1.17.0 // indirect
	github.com/sirupsen/logrus v1.6.0 // indirect
	golang.org/x/oauth2 v0.0.0-20210126194326-f9ce19ea3013 // indirect
	golang.org/x/sync v0.0.0-20200317015054-43a5402ce75a // indirect
	golang.org/x/sys v0.41.0 // indirect
	golang.org/x/text v0.3.5 // indirect
	golang.org/x/xerrors v0.0.0-20191204190536-9bdfabe68543 // indirect
	google.golang.org/appengine v1.6.6 // indirect
	google.golang.org/grpc v1.39.0 // indirect
	google.golang.org/protobuf v1.25.0 // indirect
	gopkg.in/alecthomas/kingpin.v2 v2.2.6 // indirect
	gopkg.in/yaml.v2 v2.3.0 // indirect
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
