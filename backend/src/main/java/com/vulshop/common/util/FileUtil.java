package com.vulshop.common.util;

import lombok.experimental.UtilityClass;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@UtilityClass
public class FileUtil {

    private static final List<String> IMAGE_EXTENSIONS =
            Arrays.asList("jpg", "jpeg", "png", "gif", "webp", "bmp");

    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024L; // 10MB

    public static String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    public static boolean isImage(MultipartFile file) {
        String ext = getExtension(file.getOriginalFilename());
        return IMAGE_EXTENSIONS.contains(ext);
    }

    public static boolean exceedsSize(MultipartFile file, long maxBytes) {
        return file.getSize() > maxBytes;
    }

    public static long getMaxImageSize() {
        return MAX_IMAGE_SIZE;
    }
}
