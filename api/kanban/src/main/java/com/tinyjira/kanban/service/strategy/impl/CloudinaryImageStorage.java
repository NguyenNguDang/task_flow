package com.tinyjira.kanban.service.strategy.impl;

import com.cloudinary.Cloudinary;
import com.tinyjira.kanban.service.strategy.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Primary
@Service
@RequiredArgsConstructor
public class CloudinaryImageStorage implements ImageStorageService {
        private final Cloudinary cloudinary;

        @Override
        public String upload(Long userId, byte[] data, String fileName) throws IOException {
                Map uploadResult = cloudinary.uploader().upload(
                                data,
                                Map.of(
                                                "public_id", "avatar/" + userId,
                                                "overwrite", true,
                                                "resource_type", "image",
                                                "invalidate", true));

                String url = uploadResult.get("secure_url").toString();
                // Add version parameter to force cache refresh
                String version = uploadResult.get("version").toString();
                return url + "?v=" + version + "&t=" + System.currentTimeMillis();
        }

        @Override
        public void delete(String imageUrl) {

        }
}
