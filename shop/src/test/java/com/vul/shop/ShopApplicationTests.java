package com.vul.shop;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ShopApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void vulnerabilityCatalogContainsFiftyScenarios() throws Exception {
		mockMvc.perform(get("/api/vulnerability-scenarios"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.data", hasSize(50)))
			.andExpect(jsonPath("$.data[0].id").value("VULN-001"))
			.andExpect(jsonPath("$.data[49].id").value("VULN-050"));
	}

	@Test
	void customerApiSurfaceResponds() throws Exception {
		mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"user@example.com\",\"password\":\"password\"}"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.data.relatedScenarioIds[0]").value("VULN-001"));

		mockMvc.perform(get("/api/products"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.data").isArray());
	}

	@Test
	void adminApiSurfaceResponds() throws Exception {
		mockMvc.perform(get("/api/admin/users").header("X-Debug-Admin", "true"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.data").isArray())
			.andExpect(jsonPath("$.data[0].email").exists());
	}

}
