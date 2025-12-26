/* eslint-disable @typescript-eslint/no-explicit-any */
import {Outlet, useLoaderData} from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import Header from "./Header";

export default function Project() {
    const {boardData} = useLoaderData() as any;

    return (
        <div className="flex flex-col flex-grow overflow-auto px-8 pt-6 custom-scrollbar">
            <Breadcrumb projectName={boardData.metaData.title}/>
            <Header/>
            <div className="flex-grow overflow-auto custom-scrollbar px-8 pb-4">
                <Outlet context={{ boardData }}/>
            </div>
        </div>
    );
}
