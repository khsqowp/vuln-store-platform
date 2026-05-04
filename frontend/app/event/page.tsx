"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth";

interface EventData {
  id: number;
  title: string;
  description: string;
  rewardMileage: number;
  maxParticipants: number;
  currentParticipants: number;
}

export default function EventPage() {
  const { isLoggedIn } = useAuthStore();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await apiClient.get("/v1/events");
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleParticipate = async (eventId: number) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const res = await apiClient.post(`/v1/events/${eventId}/participate`);
      if (res.data.success) {
        alert("이벤트 참여 완료! 마일리지가 지급되었습니다.");
        fetchEvents();
        // user fetch 기능이 없으므로 직접 새로고침 (간이 구현)
        window.location.reload();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "이벤트 참여 실패");
    }
  };

  if (loading) return <div className="text-center py-20">LOADING...</div>;

  return (
    <div className="container-main py-12">
      <h2 className="text-3xl font-black mb-8 border-b-2 border-black pb-4 uppercase tracking-wider">EVENTS</h2>

      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-600">
        ⚠️ <b>취약점 49 (동시성 취약점 / Race Condition)</b>: 선착순 이벤트 참여 시 DB Lock이나 동기화 처리가 없습니다. Burp Suite의 Intruder나 Turbo Intruder를 사용해 100개의 동시 요청을 보내면, 1회 제한을 뚫고 마일리지가 무한정 적립될 수 있습니다.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((ev) => (
          <div key={ev.id} className="border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow bg-white">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{ev.title}</h3>
                <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                  {ev.rewardMileage.toLocaleString()}M 지급
                </span>
              </div>
              <p className="text-gray-600 mb-6">{ev.description}</p>
              
              <div className="w-full bg-gray-200 h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-black h-full transition-all duration-500" 
                  style={{ width: `${Math.min((ev.currentParticipants / ev.maxParticipants) * 100, 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-6">
                <span>참여 인원</span>
                <span className="font-bold text-black">{ev.currentParticipants} / {ev.maxParticipants} 명</span>
              </div>
            </div>

            <button 
              onClick={() => handleParticipate(ev.id)}
              disabled={ev.currentParticipants >= ev.maxParticipants}
              className={`w-full py-4 font-bold text-white transition-colors ${
                ev.currentParticipants >= ev.maxParticipants 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              {ev.currentParticipants >= ev.maxParticipants ? '선착순 마감' : '이벤트 참여하기'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
