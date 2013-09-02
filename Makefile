all: release 

rdlist: source/rdlist.yaml
	node tools/rdlist.js
	mv rdlist.json source

release: clean
	@echo Building site into 'release'
	grunt clean release
	@echo Cleaning temporary folder
	rm -rf tmp

deploy: release
	@echo Syncing release folder with Amazon S3
	s3cmd sync release/ s3://vertigo-test1
	open http://vertigo-test1.s3-website-us-west-1.amazonaws.com

clean:
	grunt clean

ls:
	s3cmd ls s3://vertigo-test1

.PHONY: all

