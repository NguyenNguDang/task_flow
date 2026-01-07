package com.tinyjira.kanban.DTO.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BurndownChartResponse {
    private List<String> dates;
    private List<Double> idealData;
    private List<Double> actualData;
}