package com.tinyjira.kanban.service;

import com.tinyjira.kanban.DTO.response.BoardDetailResponse;
import com.tinyjira.kanban.DTO.response.ColumnDetailResponse;
import com.tinyjira.kanban.model.BoardColumn;
import com.tinyjira.kanban.utils.ColumnRequest;

import javax.validation.Valid;
import java.util.List;

public interface BoardColumnService {
    List<ColumnDetailResponse> getColumnsByBoardId(Long boardId);
    ColumnDetailResponse createColumn(Long boardId, @Valid ColumnRequest request);
}
