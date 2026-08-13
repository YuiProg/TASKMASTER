package com.example.backend.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TodoRequest {

    public String id;
    public String todoName;
    public String description;
    public Long deadline;
    public String userId;
    public Integer finished;
    public Integer del;
}
