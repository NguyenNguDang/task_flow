package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;

public class UpdateAddressCommand implements UpdateProfileCommand {
    private final String newAddress;
    
    public UpdateAddressCommand(String newAddress) {
        this.newAddress = newAddress;
    }
    
    @Override
    public void execute(User user) {
        user.setAddress(newAddress);
    }
}