import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams, } from 'react-router-dom';
import { AlertTriangle, Loader2,  ChevronRight } from 'lucide-react';
import {
  adminApi,
  type RegistrationRecord,
  type RegistrationMember,
} from '@/services/adminApi';

import { PREDEFINED_EVENTS, createEmptyMember } from './constants';
import type { MemberFormState, PredefinedEvent, RegistrationMode } from './types';

// Child Components
import RegistrationHeader from './components/RegistrationHeader';
import ModeSelector from './components/ModeSelector';
import EventSelector from './components/EventSelector';
import IndividualForm from './components/IndividualForm';
import TeamForm from './components/TeamForm';
import RegistrationSuccessCard from './components/RegistrationSuccessCard';
import RegistrationStatusModal from './components/RegistrationStatusModal';

export default function RegistrationPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Mode from URL query (e.g. ?mode=individual or ?mode=team)
  const rawModeParam = searchParams.get('mode')?.toLowerCase();
  const activeMode: RegistrationMode = rawModeParam === 'team' ? 'team' : 'individual';

  // Event & Predefined Date State (RAG Based AI is the default option with 3 July 2026)
  const [selectedEvent, setSelectedEvent] = useState<PredefinedEvent>(PREDEFINED_EVENTS[0]);

  // Form States
  const [individualMember, setIndividualMember] = useState<MemberFormState>(createEmptyMember());
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<MemberFormState[]>([
    createEmptyMember(), // Leader (index 0)
    createEmptyMember(), // Member 2 (index 1, satisfying minimum 2 members for team)
  ]);

  // Flow & Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResult, setSuccessResult] = useState<RegistrationRecord | null>(null);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Event Registration | IEEE GBPIET Student Branch';
  }, []);

  // Update URL parameter when mode switches
  const handleModeChange = (mode: RegistrationMode) => {
    setErrorMessage('');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('mode', mode);
    setSearchParams(newParams, { replace: true });
  };

  // Team Member Management
  const handleAddTeamMember = () => {
    if (teamMembers.length >= 4) return;
    setTeamMembers((prev) => [...prev, createEmptyMember()]);
  };

  const handleRemoveTeamMember = (indexToRemove: number) => {
    if (teamMembers.length <= 2) {
      setErrorMessage('Team registration must have at least 2 members (1 Leader + 1 Member).');
      return;
    }
    setErrorMessage('');
    setTeamMembers((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTeamMemberChange = (
    index: number,
    field: keyof MemberFormState,
    value: string | number
  ) => {
    setTeamMembers((prev) =>
      prev.map((member, idx) => (idx === index ? { ...member, [field]: value } : member))
    );
  };

  const handleIndividualMemberChange = (
    field: keyof MemberFormState,
    value: string | number
  ) => {
    setIndividualMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetForm = () => {
    setSuccessResult(null);
    setIndividualMember(createEmptyMember());
    setTeamMembers([createEmptyMember(), createEmptyMember()]);
    setTeamName('');
    setErrorMessage('');
  };

  // Form Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Predefined date from the selected event
    const eventName = selectedEvent.name;
    const eventDate = selectedEvent.date;

    try {
      setIsSubmitting(true);

      if (activeMode === 'individual') {
        const m = individualMember;
        if (!m.name.trim() || !m.instituteId.trim() || !m.phone.trim() || !m.email.trim()) {
          setErrorMessage('Please fill out all required fields.');
          setIsSubmitting(false);
          return;
        }

        const payloadMember: RegistrationMember = {
          instituteId: m.instituteId.trim(),
          name: m.name.trim(),
          phone: m.phone.trim(),
          email: m.email.trim(),
          year: Number(m.year),
          branch: m.branch.trim(),
        };

        const res = await adminApi.createRegistration(
          {
            eventName,
            date: eventDate,
            members: [payloadMember],
          },
          'INDIVIDUAL'
        );

        if (res.success && res.data) {
          setSuccessResult(res.data);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setErrorMessage(res.message || 'Registration failed. Please check inputs.');
        }
      } else {
        // Team mode
        if (!teamName.trim()) {
          setErrorMessage('Team name is required for team registration.');
          setIsSubmitting(false);
          return;
        }

        if (teamMembers.length < 2) {
          setErrorMessage('Team registration requires at least 2 members (1 Leader and 1 Member).');
          setIsSubmitting(false);
          return;
        }

        for (let i = 0; i < teamMembers.length; i++) {
          const m = teamMembers[i];
          const role = i === 0 ? 'Team Leader' : `Member ${i + 1}`;
          if (!m.name.trim() || !m.instituteId.trim() || !m.phone.trim() || !m.email.trim()) {
            setErrorMessage(`Please fill out all fields for ${role}.`);
            setIsSubmitting(false);
            return;
          }
        }

        const payloadMembers: RegistrationMember[] = teamMembers.map((m) => ({
          instituteId: m.instituteId.trim(),
          name: m.name.trim(),
          phone: m.phone.trim(),
          email: m.email.trim(),
          year: Number(m.year),
          branch: m.branch.trim(),
        }));

        const res = await adminApi.createRegistration(
          {
            eventName,
            date: eventDate,
            teamName: teamName.trim(),
            members: payloadMembers,
          },
          'TEAM'
        );

        if (res.success && res.data) {
          setSuccessResult(res.data);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setErrorMessage(res.message || 'Registration failed. Please check inputs.');
        }
      }
    } catch (err: unknown) {
      console.error('Registration API error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to complete registration. If backend server is waking up, please retry shortly.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <RegistrationHeader onOpenLookup={() => setIsLookupModalOpen(true)} />

        {/* Success Confirmation Card OR Registration Form */}
        {successResult ? (
          <RegistrationSuccessCard
            registration={successResult}
            onReset={handleResetForm}
          />
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            {/* Mode Selector Tab Switcher */}
            <ModeSelector
              activeMode={activeMode}
              onSelectMode={handleModeChange}
            />

            {/* Error Banner */}
            {errorMessage && (
              <div className="mt-6 flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs sm:text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-8">
              {/* Event Selector (With predefined auto-mapped date in JSX, no manual date input) */}
              <EventSelector
                selectedEvent={selectedEvent}
                onSelectEvent={setSelectedEvent}
              />

              {/* Individual Form or Team Form */}
              {activeMode === 'individual' ? (
                <IndividualForm
                  member={individualMember}
                  onChange={handleIndividualMemberChange}
                />
              ) : (
                <TeamForm
                  teamName={teamName}
                  onTeamNameChange={setTeamName}
                  members={teamMembers}
                  onMemberChange={handleTeamMemberChange}
                  onAddMember={handleAddTeamMember}
                  onRemoveMember={handleRemoveTeamMember}
                />
              )}

              {/* Form Submission Action */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
  
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registering Participant...
                    </>
                  ) : (
                    <>
                      Submit {activeMode === 'individual' ? 'Individual' : 'Team'} Registration
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer Navigation Links */}

      </div>

      {/* Quick Status Lookup Modal */}
      <RegistrationStatusModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />
    </div>
  );
}
