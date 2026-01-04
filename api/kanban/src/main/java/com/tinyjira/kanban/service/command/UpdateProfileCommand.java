package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;

public interface UpdateProfileCommand {
    void execute(User user);
}
