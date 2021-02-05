package org.example.util;

import java.net.http.HttpClient;
import java.net.http.HttpClient.Redirect;
import java.net.http.HttpClient.Version;

import org.springframework.stereotype.Component;

@Component
public class ApiClient {
  public static HttpClient getApiClient() {
    return HttpClient.newBuilder().version(Version.HTTP_2).followRedirects(Redirect.ALWAYS).build();
  }
}
