FROM openjdk:11.0.3-jdk-stretch
ENV SERVICE_URL=${SERVICE_URL}
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-Dserver.port=$PORT", "$JAVA_OPTS", "-jar",  "/app.jar"]

# ARG TOMCAT_VERSION

# FROM tomcat:$TOMCAT_VERSION
# WORKDIR /usr/local/tomcat
# COPY ./build/libs/*.war ./webapps/

# # required for Oracle DB client
# ENV TZ=EST

# CMD ["catalina.sh", "run"]
