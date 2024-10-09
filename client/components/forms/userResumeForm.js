'use client';

import { useState, useEffect } from 'react';

import DropListMulti from '@/components/common/dropListMulti';
import { dropListValidator } from '@/utils/formValidation';

import Loading from '@/components/common/loading';
import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const UserResumeForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [positions, setPositions] = useState([]);
    useEffect(() => {
        const fetchPosition = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/position/get-all?limit=100&page=1`);
                return setPositions(res?.data?.positions);
            } catch (err) {
                console.log(`Error in fetchPosition in UserResumeForm: ${err}`);
                return;
            }
        };
        fetchPosition();
    }, []);
    const [position, setPosition] = useState('');
    const [isPositionErr, setIsPositionErr] = useState(false);
    const [positionErrMsg, setPositionErrMsg] = useState({});

    const [careers, setCareers] = useState([]);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-all?limit=100&page=1`);
                const refactor = res?.data?.categories?.map((item) => {
                    return {
                        value: item?.category,
                        label: item?.category,
                    };
                });
                return setCareers(refactor);
            } catch (err) {
                console.log(`Error in fetchCategory in UserResumeForm: ${err}`);
                return;
            }
        };
        fetchCategory();
    }, []);
    const [career, setCareer] = useState(null);
    const [isCareerErr, setIsCareerErr] = useState(false);
    const [careerErrMsg, setCareerErrMsg] = useState({});

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
                console.log(`Error in fetchSkill in UserResumeForm: ${err}`);
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

    const [allProvinces, setAllProvinces] = useState([]);
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                const result = res?.data?.data?.map((item) => {
                    return { value: item?.name, label: item?.name };
                });
                setAllProvinces(result);
            } catch (err) {
                console.log(`Error in fetchProvinces in UserResumeForm: ${err}`);
                return;
            }
        };
        fetchProvinces();
    }, []);
    const [workingLocation, setWorkingLocation] = useState(null);
    const [isWorkingLocationErr, setIsWorkingLocationErr] = useState(false);
    const [workingLocationErrMsg, setWorkingLocationErrMsg] = useState({});

    useEffect(() => {
        const fetchUserResume = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resume/get`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setPosition(res?.data?.resume?.jobPosition);
                setCareer(res?.data?.resume?.careers);
                setSkill(res?.data?.resume?.skills);
                setExp(res?.data?.resume?.experience);
                setSalaryRange(res?.data?.resume?.salaryRange);
                setWorkingLocation(res?.data?.resume?.workingLocation);
                return;
            } catch (err) {
                console.log(`Error in fetchUserResume in UserResumeForm: ${err}`);
                return;
            }
        };
        fetchUserResume();
    }, []);

    const handleUpdateResume = async () => {
        const isPositionValid = dropListValidator(position, setIsPositionErr, setPositionErrMsg);
        const isCareerValid = dropListValidator(career, setIsCareerErr, setCareerErrMsg);
        const isSkillValid = dropListValidator(skill, setIsSkillErr, setSkillErrMsg);
        const isExpValid = dropListValidator(exp, setIsExpErr, setExpErrMsg);
        const isSalaryRangeValid = dropListValidator(salaryRange, setIsSalaryRangeErr, setSalaryRangeErrMsg);
        const isWorkingLocationValid = dropListValidator(
            workingLocation,
            setIsWorkingLocationErr,
            setWorkingLocationErrMsg,
        );

        if (
            !isPositionValid ||
            !isCareerValid ||
            !isSkillValid ||
            !isExpValid ||
            !isSalaryRangeValid ||
            !isWorkingLocationValid
        )
            return;

        setIsLoading(true);

        const data = {
            jobPosition: position,
            careers: career,
            skills: skill,
            experience: exp,
            salaryRange,
            workingLocation,
        };
        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/resume/update`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setIsLoading(false);
            return success(res?.data?.message);
        } catch (err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="bg-white p-7 rounded-lg">
            <h2 className="pl-4 border-l-4 border-red-600 font-semibold text-[1.8rem]">Cài đặt gợi ý việc làm</h2>
            <div className="space-y-4 mt-7">
                <label className="font-semibold text-[1.5rem]">
                    Vị trí công việc<span className="text-[1.8rem] text-red-600">*</span>
                </label>
                <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    onBlur={() => dropListValidator(position, setIsPositionErr, setPositionErrMsg)}
                    className={`block w-full text-[1.5rem] outline-[var(--primary-color)] border px-5 py-3 rounded-lg ${
                        isPositionErr ? 'border-red-600' : ''
                    }`}
                >
                    <option value="">-- Vị trí --</option>
                    {positions?.map((item, index) => {
                        return (
                            <option key={index} value={item?.position}>
                                {item?.position}
                            </option>
                        );
                    })}
                </select>
                <p className="text-red-600 text-[1.3rem]">{positionErrMsg.jobPosition}</p>
            </div>
            <div className="space-y-4 mt-3">
                <label className="font-semibold text-[1.5rem]">
                    Ngành nghề<span className="text-[1.8rem] text-red-600">*</span>
                </label>
                <DropListMulti
                    value={career}
                    onChange={setCareer}
                    onBlur={() => dropListValidator(career, setIsCareerErr, setCareerErrMsg)}
                    options={careers}
                    placeholder="-- Ngành nghề --"
                    msg={careerErrMsg.jobCareer}
                    isErr={isCareerErr}
                />
            </div>
            <div className="space-y-4 mt-3">
                <label className="font-semibold text-[1.5rem]">
                    Kỹ năng<span className="text-[1.8rem] text-red-600">*</span>
                </label>
                <DropListMulti
                    value={skill}
                    onChange={setSkill}
                    onBlur={() => dropListValidator(skill, setIsSkillErr, setSkillErrMsg)}
                    options={skills}
                    placeholder="-- Kỹ năng --"
                    msg={skillErrMsg.jobCareer}
                    isErr={isSkillErr}
                />
            </div>
            <div className="space-y-4 mt-3">
                <label className="font-semibold text-[1.5rem]">
                    Kinh nghiệm<span className="text-[1.8rem] text-red-600">*</span>
                </label>
                <select
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    onBlur={() => dropListValidator(exp, setIsExpErr, setExpErrMsg)}
                    className={`block w-full text-[1.5rem] outline-[var(--primary-color)] border px-5 py-3 rounded-lg ${
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
            <div className="space-y-4 mt-3">
                <label className="font-semibold text-[1.5rem]">
                    Mức lương<span className="text-[1.8rem] text-red-600">*</span>
                </label>
                <select
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    onBlur={() => dropListValidator(salaryRange, setIsSalaryRangeErr, setSalaryRangeErrMsg)}
                    className={`block w-full text-[1.5rem] outline-[var(--primary-color)] border px-5 py-3 rounded-lg ${
                        isSalaryRangeErr ? 'border-red-600' : ''
                    }`}
                >
                    <option value="">-- Mức lương --</option>
                    <option value="Dưới 10 triệu">Dưới 10 triệu</option>
                    <option value="15 - 20 triệu">15 - 20 triệu</option>
                    <option value="20 - 25 triệu">20 - 25 triệu</option>
                    <option value="25 - 30 triệu">25 - 30 triệu</option>
                    <option value="30 - 50 triệu">30 - 50 triệu</option>
                    <option value="Trên 50 triệu">Trên 50 triệu</option>
                    <option value="Thỏa thuận">Thỏa thuận</option>
                </select>
                <p className="text-red-600 text-[1.3rem]">{salaryRangeErrMsg.jobSalaryRange}</p>
            </div>
            <div className="space-y-4 mt-3">
                <label className="font-semibold text-[1.5rem]">
                    Địa điểm làm việc<span className="text-[1.8rem] text-red-600">*</span>
                </label>
                <DropListMulti
                    value={workingLocation}
                    onChange={setWorkingLocation}
                    onBlur={() => dropListValidator(workingLocation, setIsWorkingLocationErr, setWorkingLocationErrMsg)}
                    options={allProvinces}
                    placeholder="-- Địa điểm --"
                    msg={workingLocationErrMsg.jobLocation}
                    isErr={isWorkingLocationErr}
                />
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleUpdateResume}
                    className="flex items-center justify-center gap-3 w-fit bg-[var(--primary-color)] text-white font-medium px-16 py-3 mt-7 rounded-lg hover:bg-[var(--primary-hover-color)] transition-all"
                >
                    {isLoading && <Loading />}
                    <span>Lưu</span>
                </button>
            </div>
        </div>
    );
};

export default UserResumeForm;
