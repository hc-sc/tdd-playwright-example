FROM openjdk:11.0.3-jdk-stretch
ENV SERVICE_URL=${SERVICE_URL}
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-Dserver.port=$PORT", "$JAVA_OPTS", "-jar",  "/app.jar"]

# RUN docker build --build-arg JAR_FILE=build/libs/\*.jar -t tdd-playwright-example-api .
# FROM openjdkC
# WORKDIR /usr/src/myapp
# COPY . /usr/src/myapp
# RUN java -Dserver.port=$PORT $JAVA_OPTS -jar build/libs/api##1.0.0.1.jar
# CMD ["java", "Main"]



# ARG TOMCAT_VERSION

# FROM tomcat:$TOMCAdocker build --build-arg JAR_FILE=build/libs/\*.jar -t tdd-playwright-example-apiT_VERSION
# WORKDIR /usr/local/tomcat
# COPY ./build/libs/*.war ./webapps/

# # required for Oracle DB client
# ENV TZ=EST

# CMD ["catalina.sh", "run"]
