package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

public class ChangePasswordCommand implements UpdateProfileCommand {
    private final String oldPass;
    private final String newPass;
    private final PasswordEncoder encoder;
    
    public ChangePasswordCommand(String oldPass, String newPass, PasswordEncoder encoder) {
        this.oldPass = oldPass;
        this.newPass = newPass;
        this.encoder = encoder;
    }
    
    @Override
    public void execute(User user) {
        user.changePassword(oldPass, newPass, encoder);
        System.out.println("Password changed via Command.");
    }
}