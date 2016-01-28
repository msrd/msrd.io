all: release 

rdlist: source/rdlist.yaml
	node tools/rdlist.js
	mv rdlist.json source

release: clean
	@echo Building site into 'release'
	grunt clean release
	@echo Cleaning temporary folder

deploy: release
	surge release

clean:
	grunt clean

debug:
	grunt debug-run


.PHONY: all

