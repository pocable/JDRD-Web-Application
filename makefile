build:
	docker build -t web-jdrd .

run:
	docker run --env-file A:\\Development\\JDRDWEB_KEYS.txt -d -p 4240:80 web-jdrd