import {useState} from 'react';
import {Button} from "../../Components/Button.tsx";
import {Kanban} from "./Icons";
import {useProject} from "../../context/ProjectContext.tsx";
import {useLocation} from "react-router-dom";
import ProjectRow from "./ProjectRow.tsx";


const Item = () => {
    const [isOpen, setIsOpen] = useState(false); // Toggle menu Project to
    const { projects, isLoading } = useProject();
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="w-full">
            <Button
                icon={<Kanban />}
                active={location.pathname.includes('project')}
                onClick={toggleMenu}
                className="w-full mb-2 justify-start"
            >
                Projects
            </Button>

            {isOpen && (
                <ul className="py-2 px-2 transition-all duration-200 bg-gray-50 rounded-md">
                    {isLoading && <li className="text-gray-400 text-xs px-2">Loading...</li>}

                    {!isLoading && projects.length === 0 && (
                        <li className="text-gray-400 text-xs px-2">No projects found</li>
                    )}

                    {/* Render từng dòng Project */}
                    {projects.map((project) => (
                        <ProjectRow key={project.id} project={project} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Item;