package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;

public class UpdateBioCommand implements UpdateProfileCommand {
    private final String newBio;
    
    public UpdateBioCommand(String newBio) {
        this.newBio = newBio;
    }
    
    @Override
    public void execute(User user) {
        user.updateBio(this.newBio);
        System.out.println("Bio updated via Command.");
    }
}