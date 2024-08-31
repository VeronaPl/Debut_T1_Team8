# back

FROM openjdk:latest

VOLUME /tmp

RUN chmod -R 777 /tmp

EXPOSE 8080

ARG JAR_FILE=/target/demo-0.0.1-SNAPSHOT.jar

ADD ${JAR_FILE} backend-t1-team8.jar

ENTRYPOINT ["java","-jar","/backend-t1-team8.jar"]
