import Link from 'next/link';

import { formatVNDateTime } from '@/utils/formatDateTime';
import setSlug from '@/utils/slugify';

// import { IoBookmark } from 'react-icons/io5';

const ApplyJobCard = (props) => {
    const setStatusColor = (status) => {
        if (status === 'Đã ứng tuyển') {
            return 'text-blue-600';
        } else if (status === 'Phù hợp') {
            return 'text-green-600';
        } else {
            return 'text-red-600';
        }
    };

    return (
        <div className="relative w-full h-fit custom-shadow-v1 hover:ring-2 hover:ring-[var(--primary-color)] border rounded-lg bg-white px-7 py-5 md:px-12 md:py-10 flex flex-col justify-between">
            <div className="flex items-start gap-5">
                <div className="w-[80px] h-[80px] md:w-[110px] md:h-[110px] border border-black rounded-lg">
                    <img src={props.companyAvatar} alt="job card" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1 h-full flex flex-col justify-between">
                    <div className="pr-3">
                        <Link
                            href={`/job/${setSlug(props.jobTitle)}?requestId=${props.id}`}
                            className="text-[1.8rem] leading-8 font-semibold hover:text-[var(--primary-color)] truncate-1 md:truncate-2"
                        >
                            {props.jobTitle}
                        </Link>
                        <Link
                            href={`/company/${setSlug(props.companyName)}?requestId=${props.companyId}`}
                            className="mt-2 text-[1.5rem] truncate-1"
                        >
                            {props.companyName}
                        </Link>
                        <p className="mt-3 text-[1.5rem]">Thời gian ứng tuyển: {formatVNDateTime(props.appliedTime)}</p>
                        <a
                            href={props.cvPath}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="block mt-3 text-[1.4rem] font-medium hover:text-[var(--primary-color)]"
                        >
                            CV đã ứng tuyển
                        </a>
                        <div className="mt-5 border-t py-5">
                            Trạng thái:{' '}
                            <span className={`font-medium ${setStatusColor(props.applyStatus)}`}>
                                {props.applyStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyJobCard;
