package com.tinyjira.kanban.service.command;

import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.service.strategy.ImageStorageService;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.io.IOException;



@Builder
public record UpdateAvatarCommand(String fileName, byte[] fileData,
                                  ImageStorageService imageStorageService) implements UpdateProfileCommand {
    @Override
    public void execute(User user) throws IOException {
        String newUrl = imageStorageService.upload(user.getId(), fileData, fileName);
        user.updateAvatar(newUrl);
    }
}