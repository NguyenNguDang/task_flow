package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;

public class UpdateFullNameCommand implements UpdateProfileCommand {
    private final String newFullName;
    
    public UpdateFullNameCommand(String newFullName) {
        this.newFullName = newFullName;
    }
    
    @Override
    public void execute(User user) {
        user.setName(newFullName);
    }
}