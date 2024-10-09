import Link from 'next/link';

// import { FaRegEye } from 'react-icons/fa6';
import { GoPencil } from 'react-icons/go';
import { RiDeleteBin6Line } from 'react-icons/ri';

const MobileJobItem = (props) => {
    const refactorLocation = (location) => {
        if (location?.length > 1) {
            return `${location?.length} địa điểm`;
        } else {
            return location[0].label;
        }
    };

    return (
        <div className="w-full border p-5 flex items-start gap-5">
            <div className="w-[67px] h-[67px] rounded-lg">
                <img src={props.companyAvatar} alt="job card" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex-1">
                <h2 className="block w-full truncate-1 leading-none font-semibold">{props.jobTitle}</h2>
                <p
                    className={`mt-2 text-[1.3rem] leading-none ${
                        props.jobStatus === 'Đang tuyển' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {props.jobStatus}
                </p>
                <p className="flex gap-3 flex-wrap text-[1.3rem] font-medium mt-5">
                    <span className="rounded-md bg-[#e2e2e2] px-3 py-1">{props.jobSalaryRange}</span>
                    <span className="rounded-md bg-[#e2e2e2] px-3 py-1">
                        {refactorLocation(props.jobWorkingLocation)}
                    </span>
                </p>
                <div className="mt-5 flex items-center justify-end gap-3">
                    {/* <div className="rounded-lg bg-[var(--secondary-color)] p-3 text-[1.8rem] text-[var(--primary-color)]">
                        <FaRegEye />
                    </div> */}
                    <Link
                        href={`/employer/edit-job?requestId=${props.jobId}`}
                        className="block rounded-lg bg-[var(--secondary-color)] p-3 text-[1.8rem] text-[var(--primary-color)]"
                    >
                        <GoPencil />
                    </Link>
                    <div
                        onClick={props.handleDeleteJob}
                        className="rounded-lg bg-red-200 p-3 text-[1.8rem] text-red-600 cursor-pointer"
                    >
                        <RiDeleteBin6Line />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileJobItem;
