package com.example.backend.constants;

import lombok.Getter;

@Getter
public enum StringCodes {
    //AUTH
    USER_ADDED("USER SUCCESSFULLY ADDED."),
    USER_LOG_IN("USER LOGGED IN."),
    USER_UPDATED("USER UPDATED SUCCESSFULLY."),
    MULTIPLE_SESSION("You have been logged out because your account was accessed from another device or browser session."),
    //PRODUCTS
    PRODUCT_ADDED("PRODUCT ADDED."),
    PRODUCT_UPDATED("PRODUCT UPDATED"),
    PRODUCT_FOUND("PRODUCT FOUND"),
    PRODUCT_REMOVED("PRODUCT REMOVED.");

    private final String path;

    StringCodes(String path) {
        this.path = path;
    }
}
