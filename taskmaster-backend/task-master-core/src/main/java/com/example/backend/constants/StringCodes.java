package com.example.backend.constants;

import lombok.Getter;

@Getter
public enum StringCodes {
    USER_ADDED("USER SUCCESSFULLY ADDED."),
    USER_LOG_IN("USER LOGGED IN."),
    USER_UPDATED("USER UPDATED SUCCESSFULLY."),
    MULTIPLE_SESSION("You have been logged out because your account was accessed from another device or browser session."),

    PRODUCT_ADDED("PRODUCT ADDED."),
    PRODUCT_UPDATED("PRODUCT UPDATED"),
    PRODUCT_FOUND("PRODUCT FOUND"),
    PRODUCT_REMOVED("PRODUCT REMOVED."),

    SUCCESS("SUCCESS"),
    ERROR("ERROR"),

    TRUE("yes", 1, true),
    FALSE("no", 0, false);

    private final String path;
    private final Integer code;   // Integer instead of int
    private final Boolean flag;   // Boolean instead of boolean

    StringCodes(String path) {
        this(path, null, null);
    }

    StringCodes(String path, Integer code, Boolean flag) {
        this.path = path;
        this.code = code;
        this.flag = flag;
    }
}
