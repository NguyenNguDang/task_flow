import {useLocation} from "react-router-dom";
import {getHeaderTitle} from "../../../utils";

export default function Breadcrumb({ projectName }: { projectName: string }) {
    const location = useLocation();
    const pathName = location.pathname;

    return (
    <div className="flex flex-row items-center w-full h-8 pl-2 text-[15px] font-CircularStdBook text-[#5e6c84] gap-3">
      <div>Projects</div>
      <div>/</div>
      <div>{projectName}</div>
      <div>/</div>
      <div>{getHeaderTitle(pathName)}</div>
    </div>
  );
}