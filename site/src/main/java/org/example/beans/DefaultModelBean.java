package org.example.beans;

import org.example.config.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import goc.webtemplate.component.spring.DefaultTemplateCoreBean;

@Component("defaultmodelbean")
public class DefaultModelBean extends DefaultTemplateCoreBean {
  private static final Logger log = LoggerFactory.getLogger(DefaultModelBean.class);

  @Override
  public void onWebTemplateInitialize() {
    log.debug("Loading bean...");
    log.debug("Another thing...");
  }

  @Override
  protected String getDefaultLanguageLinkUrl() {
    String defaultLanguageLinkUrl = super.getDefaultLanguageLinkUrl();
    return defaultLanguageLinkUrl + "&" + Constants.LOCALE_INTERCEPTOR_PARAM + "="
        + getAlternateLanguage(this.getTwoLetterCultureLanguage());
  }

  private String getAlternateLanguage(String language) {
    return language.equals(goc.webtemplate.Constants.ENGLISH_ACCRONYM) ? goc.webtemplate.Constants.FRENCH_ACCRONYM
        : goc.webtemplate.Constants.ENGLISH_ACCRONYM;
  }
}