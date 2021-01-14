ARG TOMCAT_VERSION

FROM tomcat:$TOMCAT_VERSION
WORKDIR /usr/local/tomcat
COPY ./build/libs/*.war ./webapps/

# required for Oracle DB client
ENV TZ=EST

CMD ["catalina.sh", "run"]
