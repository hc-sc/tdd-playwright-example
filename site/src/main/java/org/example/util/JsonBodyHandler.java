/**
 * https://golb.hplar.ch/2019/01/java-11-http-client.html
 * https://stackoverflow.com/questions/57629401/deserializing-json-using-java-11-httpclient-and-custom-bodyhandler-with-jackson
 *
 */

package org.example.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.net.http.HttpResponse;
import java.util.function.Supplier;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JsonBodyHandler<W> implements HttpResponse.BodyHandler<Supplier<W>> {

  private final Class<W> wClass;

  public JsonBodyHandler(Class<W> wClass) {
    this.wClass = wClass;
  }

  @Override
  public HttpResponse.BodySubscriber<Supplier<W>> apply(HttpResponse.ResponseInfo responseInfo) {
    return asJSON(wClass);
  }

  public static <W> HttpResponse.BodySubscriber<Supplier<W>> asJSON(Class<W> targetType) {
    HttpResponse.BodySubscriber<InputStream> upstream = HttpResponse.BodySubscribers.ofInputStream();

    return HttpResponse.BodySubscribers.mapping(upstream, inputStream -> toSupplierOfType(inputStream, targetType));
  }

  public static <W> Supplier<W> toSupplierOfType(InputStream inputStream, Class<W> targetType) {
    return () -> {
      try (InputStream stream = inputStream) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(stream, targetType);
      } catch (IOException e) {
        throw new UncheckedIOException(e);
      }
    };
  }
}
