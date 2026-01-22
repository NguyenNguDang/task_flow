/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export const getHeaderTitle = (pathname: string): string => {
    if (pathname.includes("backlog")) {
        return 'Backlog';
    }
    if (pathname.includes("board")) {
        return 'Board';
    }
    if (pathname.includes("dashboard")) {
        return 'Dashboard';
    }
    if (pathname.includes("reports")) {
        return 'Reports';
    }
    return "Header Title";
}

export function convertToAppropriateFormat(data: any) {
    const board: any = {
        tasks: {},
        columns: {},
        columnOrder: [],
        metaData: {
            title: data.title || "Untitled Project",
        }
    };

    const apiColumns = data.columns || [];
    const apiTasks = data.tasks || [];

    apiColumns.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

    apiColumns.forEach((col: any) => {
        const colIdStr = String(col.id);

        board.columns[colIdStr] = {
            id: colIdStr,
            title: col.title,
            color: col.color, // Map color field
            taskIds: [],
        };
        board.columnOrder.push(colIdStr);
    });

    apiTasks.forEach((task: any) => {
        const taskIdStr = String(task.id);
        const columnIdStr = String(task.boardColumnId);

        // Logic map assignee: Ưu tiên lấy từ object assignee (cấu trúc mới), fallback về assigneeName (cấu trúc cũ nếu có)
        let assignees: { name: string; avatar?: string }[] = [];
        
        if (task.assignee) {
            // Kiểm tra kỹ các trường có thể có trong assignee object
            const name = task.assignee.fullName || task.assignee.name || task.assignee.username || "Unknown";
            assignees = [{
                name: name,
                avatar: task.assignee.avatarUrl
            }];
        } else if (task.assigneeName) {
            assignees = [{
                name: task.assigneeName,
                avatar: task.assigneeAvatar
            }];
        }

        board.tasks[taskIdStr] = {
            id: taskIdStr,
            title: task.title,
            description: task.description,
            assignees: assignees,
            tag: task.priority,
            status: task.status, // Map status field
            position: task.position !== undefined ? task.position : 0 // Lưu position để sort
        };

        if (board.columns[columnIdStr]) {
            board.columns[columnIdStr].taskIds.push(taskIdStr);
        } else {
            console.warn(`Task ${task.id} (Column: ${task.boardColumnId}) không khớp với cột nào.`);
        }
    });

    Object.keys(board.columns).forEach((colId) => {
        const column = board.columns[colId];

        column.taskIds.sort((taskIdA: string, taskIdB: string) => {
            const posA = board.tasks[taskIdA].position;
            const posB = board.tasks[taskIdB].position;
            return posA - posB;
        });
    });

    return board;
}
