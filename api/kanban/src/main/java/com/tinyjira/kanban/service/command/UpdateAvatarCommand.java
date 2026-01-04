package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.strategy.FileStorageStrategy;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class UpdateAvatarCommand implements UpdateProfileCommand {
    private String fileName;
    private byte[] fileData;
    private FileStorageStrategy storageStrategy;
    
    @Override
    public void execute(User user) {
        String newUrl = storageStrategy.save(fileData, fileName);
        user.updateAvatar(newUrl);
    }
}