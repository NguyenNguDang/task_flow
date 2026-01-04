import {Button} from "../Button.tsx";
import {Kanban} from "../../App/Sidebar/Icons";
import {useNavigate, useParams} from "react-router-dom";

const MenuHeader = () => {
    const navigate = useNavigate();

    const params = useParams();
    const projectId = params.projectId || params.id;

    const handleNavigate = (path: string) => {
        if (projectId) {
            navigate(`/project/${projectId}/${path}`);
        }
    };
    return (
        <div className="mx-4 pt-4 pl-4">
            <p>Name</p>
            <div className="flex justify-start items-center gap-3 py-4">
                <div>
                    <Button
                        icon={<Kanban />}
                        active={location.pathname.includes('backlog')}
                        onClick={() => handleNavigate('backlog')}
                        className="w-full mb-2 justify-start"
                    >
                        Backlog
                    </Button>
                </div>
                <div>
                    <Button
                        icon={<Kanban />}
                        active={location.pathname.includes('board')}
                        onClick={() => handleNavigate('board')}
                        className="w-full mb-2 justify-start"
                    >
                        Board
                    </Button>
                </div>
                <div>...</div>
            </div>
        </div>
    );
};

export default MenuHeader;
