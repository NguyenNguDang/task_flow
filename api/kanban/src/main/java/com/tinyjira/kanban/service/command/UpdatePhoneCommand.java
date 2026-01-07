package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;

public class UpdatePhoneCommand implements UpdateProfileCommand {
    private final String newPhone;
    
    public UpdatePhoneCommand(String newPhone) {
        this.newPhone = newPhone;
    }
    
    @Override
    public void execute(User user) {
        user.updatePhone(newPhone);
    }
}
