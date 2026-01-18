package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;

import java.io.IOException;

public interface UpdateProfileCommand {
    void execute(User user) throws IOException;
}
