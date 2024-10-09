'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false,
});
import DropListMulti from '../common/dropListMulti';
import { dropListValidator, fullNameValidator, dateValidator, disabledPastDate } from '@/utils/formValidation';

import Loading from '../common/loading';
import axios from 'axios';
import { socket } from '@/socket';

import { success, error } from '@/utils/toastMessage';

const CreateJobForm = ({ formTitle }) => {
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    const [jobTitle, setJobTitle] = useState('');
    const [isJobTitleErr, setIsJobTitleErr] = useState(false);
    const [jobTitleErrMsg, setJobTitleErrMsg] = useState({});

    const [jobDesc, setJobDesc] = useState('');

    const [careers, setCareers] = useState([]);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-all?limit=100&page=1`);
                return setCareers(res?.data?.categories);
            } catch (err) {
                console.log(`An error occurred in the fetchCategory function: ${err?.response?.data?.message}`);
                return;
            }
        };

        fetchCategory();
    }, []);
    const [career, setCareer] = useState(null);
    const [isCareerErr, setIsCareerErr] = useState(false);
    const [careerErrMsg, setCareerErrMsg] = useState({});

    const [positions, setPositions] = useState([]);
    useEffect(() => {
        const fetchPosition = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/position/get-all?limit=100&page=1`);
                return setPositions(res?.data?.positions);
            } catch (err) {
                console.log(`An error occurred in the fetchPosition function: ${err?.response?.data?.message}`);
                return;
            }
        };

        fetchPosition();
    }, []);
    const [position, setPosition] = useState('');
    const [isPositionErr, setIsPositionErr] = useState(false);
    const [positionErrMsg, setPositionErrMsg] = useState({});

    const [skills, setSkills] = useState([]);
    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/skill/get-all?limit=100&page=1`);
                const refactor = res?.data?.skills?.map((item) => {
                    return {
                        value: item?.skill,
                        label: item?.skill,
                    };
                });
                return setSkills(refactor);
            } catch (err) {
                console.log(`An error occurred in the fetchSkill function: ${err?.response?.data?.message}`);
                return;
            }
        };

        fetchSkill();
    }, []);
    const [skill, setSkill] = useState(null);
    const [isSkillErr, setIsSkillErr] = useState(false);
    const [skillErrMsg, setSkillErrMsg] = useState({});

    const [exp, setExp] = useState(null);
    const [isExpErr, setIsExpErr] = useState(false);
    const [expErrMsg, setExpErrMsg] = useState({});

    const [salaryRange, setSalaryRange] = useState(null);
    const [isSalaryRangeErr, setIsSalaryRangeErr] = useState(false);
    const [salaryRangeErrMsg, setSalaryRangeErrMsg] = useState({});

    const [jobType, setJobType] = useState('');
    const [isJobTypeErr, setIsJobTypeErr] = useState(false);
    const [jobTypeErrMsg, setJobTypeErrMsg] = useState({});

    const [allProvinces, setAllProvinces] = useState([]);
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                const result = res?.data?.data?.map((item) => {
                    return { label: item?.name, value: item?.name };
                });
                setAllProvinces(result);
            } catch (err) {
                console.log(`An error occurred in the fetchProvinces function: ${err?.response?.data?.message}`);
            }
        };
        fetchProvinces();
    }, []);
    const [workingLocation, setWorkingLocation] = useState(null);
    const [isWorkingLocationErr, setIsWorkingLocationErr] = useState(false);
    const [workingLocationErrMsg, setWorkingLocationErrMsg] = useState({});

    const [jobDeadline, setJobDeadline] = useState('');
    const [isJobDeadlineErr, setIsJobDeadlineErr] = useState(false);
    const [jobDeadlineErrMsg, setJobDeadlineErrMsg] = useState({});

    useEffect(() => {
        if (!searchParams.get('requestId')) return;

        const fetchJob = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get/${searchParams.get('requestId')}`,
                );
                setJobTitle(res?.data?.job?.jobTitle);
                setJobDesc(res?.data?.job?.jobDesc);
                setCareer(res?.data?.job?.jobCareers);
                setPosition(res?.data?.job?.jobPosition);
                setSkill(res?.data?.job?.jobSkills);
                setExp(res?.data?.job?.jobExp);
                setSalaryRange(res?.data?.job?.jobSalaryRange);
                setJobType(res?.data?.job?.jobType);
                setWorkingLocation(res?.data?.job?.jobWorkingLocation);
                setJobDeadline(res?.data?.job?.jobDeadline);
                return;
            } catch (err) {
                console.log(`An error occurred in the fetchJob function: ${err?.response?.data?.message}`);
                return;
            }
        };

        fetchJob();
    }, [searchParams.get('requestId')]);

    const handleCreateJob = async () => {
        const isTitleValid = fullNameValidator(jobTitle, setIsJobTitleErr, setJobTitleErrMsg);
        const isCareerValid = dropListValidator(career, setIsCareerErr, setCareerErrMsg);
        const isPositionValid = dropListValidator(position, setIsPositionErr, setPositionErrMsg);
        const isSkillValid = dropListValidator(skill, setIsSkillErr, setSkillErrMsg);
        const isExpValid = dropListValidator(exp, setIsExpErr, setExpErrMsg);
        const isSalaryRangeValid = dropListValidator(salaryRange, setIsSalaryRangeErr, setSalaryRangeErrMsg);
        const isWorkingLocationValid = dropListValidator(
            workingLocation,
            setIsWorkingLocationErr,
            setWorkingLocationErrMsg,
        );
        const isDeadlineValid = dateValidator(jobDeadline, setIsJobDeadlineErr, setJobDeadlineErrMsg);

        if (
            !isTitleValid ||
            !isCareerValid ||
            !isPositionValid ||
            !isSkillValid ||
            !isExpValid ||
            !isSalaryRangeValid ||
            !isWorkingLocationValid ||
            !isDeadlineValid
        ) {
            return;
        }

        setIsLoading(true);

        const data = {
            jobTitle,
            jobDesc,
            jobCareers: career,
            jobPosition: position,
            jobSkills: skill,
            jobExp: exp,
            jobSalaryRange: salaryRange,
            jobType,
            jobWorkingLocation: workingLocation,
            jobDeadline,
        };

        let res;

        try {
            if (searchParams.get('requestId')) {
                res = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/update/${searchParams.get('requestId')}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                    },
                );
            } else {
                res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/job/create`, data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
            }
            if (!searchParams.get('requestId')) {
                res?.data?.receiverIds?.map((item) => {
                    return socket.emit('sendNotification', {
                        receiverId: item,
                    });
                });
            }
            setIsLoading(false);
            success(res?.data?.message);
            return router.push('/employer/manage-jobs');
        } catch (err) {
            setIsLoading(false);
            return error(res?.data?.message);
        }
    };

    return (
        <div className="p-10">
            <div className="bg-white p-7">
                <h2 className="mb-5 border-l-4 border-red-600 pl-4 text-[1.8rem] font-semibold">{formTitle}</h2>
                <div className="block md:grid grid-cols-2 gap-5">
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Tên công việc<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <input
                            placeholder="Thực tập sinh IT support"
                            type="text"
                            value={jobTitle == null ? '' : jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            onBlur={() => fullNameValidator(jobTitle, setIsJobTitleErr, setJobTitleErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isJobTitleErr ? 'border-red-600' : ''
                            }`}
                        />
                        <p className="text-[1.3rem] text-red-600">{jobTitleErrMsg.jobTitle}</p>
                    </div>
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Ngày hết hạn<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={jobDeadline == null ? '' : jobDeadline}
                            min={disabledPastDate()}
                            onChange={(e) => setJobDeadline(e.target.value)}
                            onBlur={() => dateValidator(jobDeadline, setIsJobDeadlineErr, setJobDeadlineErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isJobDeadlineErr ? 'border-red-600' : ''
                            }`}
                        />
                        <p className="text-[1.3rem] text-red-600">{jobDeadlineErrMsg.jobDeadline}</p>
                    </div>
                </div>
                <div className="block md:grid grid-cols-2 gap-5">
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Vị trí công việc<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <select
                            value={position == null ? '' : position}
                            onChange={(e) => setPosition(e.target.value)}
                            onBlur={() => dropListValidator(position, setIsPositionErr, setPositionErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isPositionErr ? 'border-red-600' : ''
                            }`}
                        >
                            <option value="">-- Vị trí --</option>
                            {positions?.map((p, index) => {
                                return (
                                    <option key={index} value={p?.position}>
                                        {p?.position}
                                    </option>
                                );
                            })}
                        </select>
                        <p className="text-[1.3rem] text-red-600">{positionErrMsg.jobPosition}</p>
                    </div>
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Hình thức<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <select
                            value={jobType == null ? '' : jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            onBlur={() => dropListValidator(jobType, setIsJobTypeErr, setJobTypeErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isJobTypeErr ? 'border-red-600' : ''
                            }`}
                        >
                            <option value="">-- Hình thức --</option>
                            <option value="Full time">Full time</option>
                            <option value="Part time">Part time</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="Thời vụ">Thời vụ</option>
                        </select>
                        <p className="text-[1.3rem] text-red-600">{jobTypeErrMsg.jobType}</p>
                    </div>
                </div>
                <div className="mt-7 space-y-4">
                    <label className="text-[1.5rem] font-semibold">
                        Ngành nghề<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <select
                        value={career == null ? '' : career}
                        onChange={(e) => setCareer(e.target.value)}
                        onBlur={() => dropListValidator(career, setIsCareerErr, setCareerErrMsg)}
                        className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                            isCareerErr ? 'border-red-600' : ''
                        }`}
                    >
                        <option value="">-- Ngành nghề --</option>
                        {careers?.map((c, index) => {
                            return (
                                <option key={index} value={c?.category}>
                                    {c?.category}
                                </option>
                            );
                        })}
                    </select>
                    <p className="text-red-600 text-[1.3rem]">{careerErrMsg.jobCareer}</p>
                </div>
                <div className="block md:grid grid-cols-2 gap-5">
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Kinh nghiệm<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <select
                            value={exp == null ? '' : exp}
                            onChange={(e) => setExp(e.target.value)}
                            onBlur={() => dropListValidator(exp, setIsExpErr, setExpErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isExpErr ? 'border-red-600' : ''
                            }`}
                        >
                            <option value="">-- Kinh nghiệm --</option>
                            <option value="Chưa có kinh nghiệm">Chưa có kinh nghiệm</option>
                            <option value="Dưới 1 năm">Dưới 1 năm</option>
                            <option value="1 năm">1 năm</option>
                            <option value="2 năm">2 năm</option>
                            <option value="3 năm">3 năm</option>
                            <option value="4 năm">4 năm</option>
                            <option value="5 năm">5 năm</option>
                            <option value="Trên 5 năm">Trên 5 năm</option>
                        </select>
                        <p className="text-red-600 text-[1.3rem]">{expErrMsg.jobExp}</p>
                    </div>
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Kỹ năng<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <DropListMulti
                            placeholder="-- Kỹ năng --"
                            value={skill}
                            options={skills}
                            onChange={setSkill}
                            onBlur={() => dropListValidator(skill, setIsSkillErr, setSkillErrMsg)}
                            isErr={isSkillErr}
                            msg={skillErrMsg.jobCareer}
                        />
                    </div>
                </div>
                <div className="block md:grid grid-cols-2 gap-5">
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Mức lương<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <select
                            value={salaryRange == null ? '' : salaryRange}
                            onChange={(e) => setSalaryRange(e.target.value)}
                            onBlur={() => dropListValidator(salaryRange, setIsSalaryRangeErr, setSalaryRangeErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isSalaryRangeErr ? 'border-red-600' : ''
                            }`}
                        >
                            <option value="">-- Mức lương --</option>
                            <option value="Dưới 10 triệu">Dưới 10 triệu</option>
                            <option value="15 - 20 triệu">10 - 15 triệu</option>
                            <option value="15 - 20 triệu">15 - 20 triệu</option>
                            <option value="20 - 25 triệu">20 - 25 triệu</option>
                            <option value="25 - 30 triệu">25 - 30 triệu</option>
                            <option value="30 - 50 triệu">30 - 50 triệu</option>
                            <option value="Trên 50 triệu">Trên 50 triệu</option>
                            <option value="Thỏa thuận">Thỏa thuận</option>
                        </select>
                        <p className="text-[1.3rem] text-red-600">{salaryRangeErrMsg.jobSalaryRange}</p>
                    </div>
                    <div className="space-y-4 mt-7">
                        <label className="font-semibold text-[1.5rem]">
                            Địa điểm làm việc<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <DropListMulti
                            placeholder="-- Địa điểm --"
                            value={workingLocation}
                            options={allProvinces}
                            onChange={setWorkingLocation}
                            onBlur={() =>
                                dropListValidator(workingLocation, setIsWorkingLocationErr, setWorkingLocationErrMsg)
                            }
                            isErr={isWorkingLocationErr}
                            msg={workingLocationErrMsg.jobLocation}
                        />
                    </div>
                </div>
                <div className="mt-7 space-y-4">
                    <label className="text-[1.5rem] font-semibold">Mô tả công việc</label>
                    <JoditEditor value={jobDesc} tabIndex={1} onBlur={(newContent) => setJobDesc(newContent)} />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleCreateJob}
                        className="mt-7 w-fit rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-16 py-3 flex items-center justify-center gap-3 font-medium text-white transition-all"
                    >
                        {isLoading && <Loading />}
                        <span>Lưu</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateJobForm;
