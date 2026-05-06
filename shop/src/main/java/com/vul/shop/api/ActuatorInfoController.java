package com.vul.shop.api;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ActuatorInfoController {
	@GetMapping("/actuator/info")
	public Map<String, Object> info() {
		return Map.of(
			"app", "vul-shop",
			"springBoot", "3.5.14",
			"tomcat", "10.1.54",
			"java", System.getProperty("java.version"),
			"diagnosticNote", "VULN-043 exposes framework and runtime information."
		);
	}
}
