import  {useState} from 'react';
import {Button} from "../../Components/Button.tsx";
import {Kanban} from "./Icons";
import {Link} from "react-router-dom";
import { AiFillCaretRight } from "react-icons/ai";

const Item = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    return (
        <div className="w-full">
            <Button
                icon={<Kanban />}
                active={location.pathname.includes('project')}
                onClick={toggleMenu}
                className="w-full mb-2 justify-start "
            >
                Project
            </Button>
            {isOpen && (
                <ul className="py-2 px-4">
                    <li ><Link to="/" className="flex flex-row my-1 p-1"><AiFillCaretRight />Project 1</Link></li>
                    <li ><Link to="/" className="flex flex-row my-1 p-1 "><AiFillCaretRight />Project 2</Link></li>
                    <li ><Link to="/" className="flex flex-row my-1 p-1 "><AiFillCaretRight />Project 3</Link></li>
                </ul>
            )}
        </div>
    );
};

export default Item;
