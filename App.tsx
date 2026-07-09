import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, EmergencyGoal, Loan, Occupation, Product, RiskCategory, Section, sections } from './src/data';
import { TabBar, TabId } from './src/components';
import {
  BankLinkScreen,
  CalculatorScreen,
  CreateAccountScreen,
  DashboardScreen,
  EmergencyGoalScreen,
  InsuranceScreen,
  IntroScreen,
  LinkedBank,
  LoanDetailScreen,
  LoginScreen,
  LoansScreen,
  OccupationScreen,
  ProductScreen,
  RetirementScreen,
  RiskQuizScreen,
  SectionScreen,
} from './src/screens';
import { colors } from './src/theme';

const STORAGE_KEY = 'jaga:v1';

type Overlay =
  | null
  | { name: 'section'; section: Section }
  | { name: 'product'; product: Product; fromSection?: Section }
  | { name: 'loan'; loan: Loan }
  | { name: 'bankLink'; forProduct?: Product; fromSection?: Section }
  | { name: 'calculator' }
  | { name: 'riskQuiz' }
  | { name: 'emergencyGoal'; product: Product };

export default function App() {
  const [started, setStarted] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [pickingOccupation, setPickingOccupation] = useState(false);
  const [tab, setTab] = useState<TabId>('home');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [activePlanIds, setActivePlanIds] = useState<string[]>([]);
  const [linkedBank, setLinkedBank] = useState<LinkedBank | null>(null);
  const [autoDebit, setAutoDebit] = useState(false);
  const [emergencyGoal, setEmergencyGoal] = useState<EmergencyGoal | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskCategory | null>(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate persisted state on mount. The password is never part of this
  // snapshot — Account carries no password field by design (see Task 4 note
  // in CreateAccountScreen).
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return; // first run — defaults apply
        try {
          const s = JSON.parse(raw);
          if (typeof s.started === 'boolean') setStarted(s.started);
          if (s.account) {
            // migrate pre-isMuslim accounts that stored full religion
            if (typeof s.account.isMuslim !== 'boolean') {
              s.account.isMuslim = s.account.religion === 'Islam';
              delete s.account.religion;
            }
            setAccount(s.account);
          }
          if (s.occupation) setOccupation(s.occupation);
          if (Array.isArray(s.activePlanIds)) setActivePlanIds(s.activePlanIds);
          if (s.linkedBank) setLinkedBank(s.linkedBank);
          if (typeof s.autoDebit === 'boolean') setAutoDebit(s.autoDebit);
          if (s.emergencyGoal) setEmergencyGoal(s.emergencyGoal);
          if (typeof s.loggedOut === 'boolean') setLoggedOut(s.loggedOut);
          if (s.riskProfile) setRiskProfile(s.riskProfile);
        } catch {
          // corrupt store — fall back to defaults
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  // Write back whenever persisted values change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ started, account, occupation, activePlanIds, linkedBank, autoDebit, emergencyGoal, loggedOut, riskProfile }),
    ).catch(() => {});
  }, [hydrated, started, account, occupation, activePlanIds, linkedBank, autoDebit, emergencyGoal, loggedOut, riskProfile]);

  const resetApp = () => {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    setStarted(false);
    setAccount(null);
    setOccupation(null);
    setPickingOccupation(false);
    setTab('home');
    setOverlay(null);
    setActivePlanIds([]);
    setLinkedBank(null);
    setAutoDebit(false);
    setEmergencyGoal(null);
    setLoggedOut(false);
    setRiskProfile(null);
  };

  const togglePlan = (id: string) =>
    setActivePlanIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const switchTab = (t: TabId) => {
    setOverlay(null);
    setTab(t);
  };

  const isInsuranceProduct = (p: Product) =>
    sections.find((s) => s.id === p.sectionId)?.group === 'insurance';

  // Insurance activation requires a DuitNow AutoDebit consent; retirement stays optional.
  const requestToggle = (product: Product, fromSection?: Section) => {
    const activating = !activePlanIds.includes(product.id);
    if (activating && isInsuranceProduct(product) && !linkedBank) {
      setOverlay({ name: 'bankLink', forProduct: product, fromSection });
      return;
    }
    togglePlan(product.id);
  };

  // Emergency-fund products ask for a savings goal before the first visit
  const openProduct = (product: Product, fromSection?: Section) => {
    if (product.sectionId === 'emergency' && !emergencyGoal) {
      setOverlay({ name: 'emergencyGoal', product });
    } else {
      setOverlay({ name: 'product', product, fromSection });
    }
  };

  // Avoid a flash of the intro while the persisted state loads.
  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
      </View>
    );
  }

  // Logged out but account data kept: show login; any non-empty credentials
  // restore the session (prototype — no real auth). New users wipe and restart.
  if (account && loggedOut) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen onLogin={() => setLoggedOut(false)} onNewUser={resetApp} />
      </>
    );
  }

  // ── onboarding: intro → account → occupation ──
  if (!started) {
    return (
      <>
        <StatusBar style="dark" />
        <IntroScreen onStart={() => setStarted(true)} />
      </>
    );
  }
  if (!account) {
    return (
      <>
        <StatusBar style="dark" />
        <CreateAccountScreen onCreate={setAccount} onBack={() => setStarted(false)} />
      </>
    );
  }
  if (!occupation || pickingOccupation) {
    return (
      <>
        <StatusBar style="dark" />
        <OccupationScreen
          onBack={() => (occupation ? setPickingOccupation(false) : setAccount(null))}
          onSelect={(o) => {
            setOccupation(o);
            setPickingOccupation(false);
            setOverlay(null);
          }}
        />
      </>
    );
  }

  // ── main app with tab bar ──
  let content: React.ReactNode;
  if (overlay?.name === 'emergencyGoal') {
    content = (
      <EmergencyGoalScreen
        initial={emergencyGoal}
        onSet={(g) => {
          setEmergencyGoal(g);
          setOverlay({ name: 'product', product: overlay.product });
        }}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay?.name === 'product') {
    content = (
      <ProductScreen
        product={overlay.product}
        isActive={activePlanIds.includes(overlay.product.id)}
        paymentRequired={
          isInsuranceProduct(overlay.product) && !linkedBank && !overlay.product.referenceOnly
        }
        emergencyGoal={emergencyGoal}
        onAdjustGoal={() => setOverlay({ name: 'emergencyGoal', product: overlay.product })}
        onToggleActive={() => requestToggle(overlay.product, overlay.fromSection)}
        onBack={() =>
          setOverlay(overlay.fromSection ? { name: 'section', section: overlay.fromSection } : null)
        }
      />
    );
  } else if (overlay?.name === 'section') {
    content = (
      <SectionScreen
        section={overlay.section}
        occupation={occupation}
        activePlanIds={activePlanIds}
        onBack={() => setOverlay(null)}
        onOpenProduct={(product) => openProduct(product, overlay.section)}
      />
    );
  } else if (overlay?.name === 'loan') {
    content = <LoanDetailScreen loan={overlay.loan} onBack={() => setOverlay(null)} />;
  } else if (overlay?.name === 'bankLink') {
    const returnTo = overlay.forProduct
      ? { name: 'product' as const, product: overlay.forProduct, fromSection: overlay.fromSection }
      : null;
    content = (
      <BankLinkScreen
        linkedBank={linkedBank}
        forProductName={overlay.forProduct?.name}
        onLink={(b) => {
          setLinkedBank(b);
          setAutoDebit(true);
          setOverlay(returnTo);
        }}
        onUnlink={() => {
          setLinkedBank(null);
          setAutoDebit(false);
          setOverlay(returnTo);
        }}
        onBack={() => setOverlay(returnTo)}
      />
    );
  } else if (overlay?.name === 'calculator') {
    content = <CalculatorScreen onBack={() => setOverlay(null)} />;
  } else if (overlay?.name === 'riskQuiz') {
    content = (
      <RiskQuizScreen
        onDone={(c) => {
          setRiskProfile(c);
          setOverlay(null);
        }}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (tab === 'home') {
    content = (
      <DashboardScreen
        account={account}
        occupation={occupation}
        activePlanIds={activePlanIds}
        linkedBank={linkedBank}
        autoDebit={autoDebit}
        onToggleAutoDebit={() => setAutoDebit((v) => !v)}
        onOpenBankLink={() => setOverlay({ name: 'bankLink' })}
        onOpenProduct={(product) => openProduct(product)}
        onBrowse={switchTab}
        onChangeOccupation={() => setPickingOccupation(true)}
        onLogout={() => setLoggedOut(true)}
      />
    );
  } else if (tab === 'insurance') {
    content = (
      <InsuranceScreen
        occupation={occupation}
        activePlanIds={activePlanIds}
        onOpenSection={(section) => setOverlay({ name: 'section', section })}
      />
    );
  } else if (tab === 'retirement') {
    // Mandatory gate: the risk quiz must be completed before first access.
    content = !riskProfile ? (
      <RiskQuizScreen onDone={setRiskProfile} onBack={() => switchTab('home')} />
    ) : (
      <RetirementScreen
        occupation={occupation}
        isMuslim={account.isMuslim}
        riskProfile={riskProfile}
        activePlanIds={activePlanIds}
        onOpenProduct={(product) => openProduct(product)}
        onOpenCalculator={() => setOverlay({ name: 'calculator' })}
        onRetakeQuiz={() => setOverlay({ name: 'riskQuiz' })}
      />
    );
  } else {
    content = (
      <LoansScreen occupation={occupation} onOpenLoan={(loan) => setOverlay({ name: 'loan', loan })} />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>{content}</View>
      <TabBar current={tab} onChange={switchTab} />
    </View>
  );
}
