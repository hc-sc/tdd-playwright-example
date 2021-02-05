package org.example.pages.index;

import org.springframework.stereotype.Component;

import goc.webtemplate.component.spring.DefaultTemplateCoreBean;

@Component(value = "indexbean")
public class IndexBean extends DefaultTemplateCoreBean {

  @Override
  public void onWebTemplateInitialize() {
    this.setHeaderTitle("Title set for every page!");
  }

  public String getWeather() {
    return "Sunny";
  }

  public String getSessionId() {
    return this.getRequest().getSession().getId();
  }
}
