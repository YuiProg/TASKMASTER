package com.example.backend.constants;

import lombok.Getter;

@Getter
public enum ApiEndpoint {
    //USER ENDPOINTS
    ADD_USER("/api/v1/addUser"),
    LOGIN("/api/v1/login"),
    LOGOUT("/api/v1/logout"),
    GET_USERS("/api/v1/getUsers"),
    SEARCH_USERS("/api/v1/searchUsers"),
    UPDATE_USER("/api/v1/updateUser/{id}"),
    DELETE_USER("/api/v1/deleteUser"),
    GET_USER_BY_ID("/api/v1/getUserById/{id}"),
    GET_AUTH_USER("/api/v1/getAuthUser"),

    //PRODUCTS
    ADD_PRODUCT("/api/v1/addProduct"),
    UPDATE_PRODUCT("/api/v1/updateProduct/{id}"),
    GET_PRODUCTS("/api/v1/getProducts"),
    DELETE_PRODUCT("/api/v1/deleteProduct/{id}"),

    //BRANCH
    ADD_BRANCH("/api/v1/addBranch"),
    GET_BRANCH("/api/v1/getBranches"),
    GET_BRANCH_BY_NAME("/api/v1/getBranchByName"),
    GET_USERS_ON_BRANCH("/api/v1/getUsersOnBranch/{id}"),

    //PROJECT
    ADD_PROJECT("/api/v1/addProject"),
    GET_AUTH_PROJECTS("/api/v1/getAuthUserProjects"),
    ADD_MEMBER_PROJECT("/api/v1/addProjectMembers/{projectId}/{userId}"),
    REMOVE_MEMBER_PROJECT("/api/v1/removeProjectMembers/{projectId}/{userId}"),
    GET_PROJECTS("/api/v1/getProjects"),
    GET_PROJECT_BY_ID("/api/v1/getProjectById/{projectId}"),

    //TASK
    ADD_TASK("/api/v1/createTask"),
    GET_AUTHENTICATED_TASK("/api/v1/getAuthenticatedUserTask"),
    UPDATE_TASK("/api/v1/updateTasl/{taskId}/{status}"),
    GET_TASK_BY_ID("/api/v1/getTaskById/{id}"),

    //COMMENTS
    ADD_COMMENT("/api/v1/comments/newComment"),
    GET_COMMENTS_BY_PROJECT("/api/v1/comments/project/{projectId}"),
    GET_COMMENTS_BY_USER("/api/v1/comments/user/{userId}"),
    UPDATE_COMMENT("/api/v1/comments/updateComment/{id}"),
    DELETE_COMMENT("/api/v1/comments/deleteComment/{id}"),
    LIKE_COMMENT("/api/v1/comments/like/{id}"),

    //FEIGN
    USER_BY_ID("/api/v1/getUserById/**"),
    PROJECT_BY_ID("/api/v1/getProjectById/**"),
    GET_AUTH("/api/v1/getAuthUser"),
    GET_TASK("/api/v1/getTaskById/{id}");

    private final String path;

    ApiEndpoint(String path) {
        this.path = path;
    }
}