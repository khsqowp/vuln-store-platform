package com.vulshop.infra.file;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    @Value("${file.upload-dir:/app/uploads}")
    private String uploadDir;

    public String store(MultipartFile file, String category) {
        if (file.isEmpty()) {
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED, "빈 파일은 업로드할 수 없습니다");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = extractExtension(originalFilename);
        String storedFilename = UUID.randomUUID() + (extension.isEmpty() ? "" : "." + extension);

        try {
            Path categoryPath = Paths.get(uploadDir, category);
            if (!Files.exists(categoryPath)) {
                Files.createDirectories(categoryPath);
            }

            Path targetPath = categoryPath.resolve(storedFilename);
            file.transferTo(targetPath);

            log.info("File stored: {}", targetPath);
            return "/uploads/" + category + "/" + storedFilename;
        } catch (IOException e) {
            log.error("File upload failed: {}", e.getMessage());
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public void delete(String filePath) {
        try {
            Path path = Paths.get(uploadDir).resolve(
                    filePath.replace("/uploads/", "")
            );
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("File delete failed: {}", filePath);
        }
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}
