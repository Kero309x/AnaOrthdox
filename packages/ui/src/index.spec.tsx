import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import {
  AppButton,
  AppIconButton,
  AppCard,
  AppBadge,
  AppTextField,
  AppSelect,
  AppTopAppBar,
  AppNavigationBar,
  AppNavigationRail,
  AppTabs,
  AppChip,
  AppList,
  AppListItem,
  AppSnackbar,
  AppProgressIndicator,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonCalendar,
  EmptyState,
  ErrorState,
  OfflineState,
  NoResultsState,
  SourceProvenanceBadge,
  AppFAB,
  FloatingActionButton,
  AppNavigationDrawer,
  NavigationDrawer,
  AppPasswordField,
  PasswordField,
  AppCheckbox,
  Checkbox,
  AppSwitch,
  Switch,
  AppDivider,
  Divider,
  AppLogo,
  FilledButton,
  OutlinedButton,
  TextButton,
  TonalButton,
  ElevatedButton,
  ElevatedCard,
  FilledCard,
  OutlinedCard,
  IconButton,
} from "./index";

describe("Material 3 Component Suite (@ana-orthodox/ui)", () => {
  describe("AppButton", () => {
    it("should render filled variant with official Material Web custom element", () => {
      const html = renderToString(<AppButton variant="filled">اضغط هنا</AppButton>);
      assert.ok(html.includes("md-filled-button"));
      assert.ok(html.includes("اضغط هنا"));
      assert.ok(html.includes("min-h-[48px]"));
    });

    it("should render disabled and loading states with aria-busy and spinner", () => {
      const html = renderToString(
        <AppButton isLoading disabled>
          تحميل
        </AppButton>
      );
      assert.ok(html.includes("disabled"));
      assert.ok(html.includes("animate-spin"));
    });
  });

  describe("AppIconButton", () => {
    it("should render accessible icon button with mandatory aria-label and Material Web element", () => {
      const html = renderToString(<AppIconButton aria-label="إغلاق">✕</AppIconButton>);
      assert.ok(html.includes("md-icon-button"));
      assert.ok(html.includes('aria-label="إغلاق"'));
    });
  });

  describe("AppCard & AppBadge", () => {
    it("should render elevated card using M3E custom element and badges", () => {
      const html = renderToString(
        <AppCard variant="elevated">
          <AppBadge label="معتمد" variant="primary" />
          <span>محتوى البطاقة</span>
        </AppCard>
      );
      assert.ok(html.includes("m3e-card"));
      assert.ok(html.includes("محتوى البطاقة"));
      assert.ok(html.includes("rounded-2xl"));
      assert.ok(html.includes("معتمد"));
    });
  });

  describe("AppTextField & AppSelect", () => {
    it("should render outlined textfield with error state using Material Web", () => {
      const html = renderToString(
        <AppTextField
          label="البريد الإلكتروني"
          errorText="البريد غير صحيح"
          defaultValue="invalid"
        />
      );
      assert.ok(html.includes("md-outlined-text-field"));
      assert.ok(html.includes('label="البريد الإلكتروني"'));
      assert.ok(html.includes('errorText="البريد غير صحيح"'));
    });

    it("should render dropdown options using Material Web select components", () => {
      const html = renderToString(
        <AppSelect
          label="اللغة"
          options={[
            { value: "ar", label: "العربية" },
            { value: "cop", label: "القبطية" },
          ]}
        />
      );
      assert.ok(html.includes("md-outlined-select"));
      assert.ok(html.includes("md-select-option"));
      assert.ok(html.includes("العربية"));
      assert.ok(html.includes("القبطية"));
    });
  });

  describe("AppNavigation, Tabs & Chips", () => {
    it("should render TopAppBar, NavigationBar, NavigationRail, Tabs, and Chips", () => {
      const dests = [
        { id: "home", label: "الرئيسية", icon: "🏠", href: "/", isActive: true },
        { id: "cal", label: "التقويم", icon: "📅", href: "/calendar", isActive: false },
      ];

      const topBarHtml = renderToString(<AppTopAppBar title="أنا أرثوذكس" />);
      assert.ok(topBarHtml.includes("أنا أرثوذكس"));

      const bottomBarHtml = renderToString(<AppNavigationBar destinations={dests} />);
      assert.ok(bottomBarHtml.includes("الرئيسية"));
      assert.ok(bottomBarHtml.includes("bg-[#D7F0E5]"));

      const railHtml = renderToString(<AppNavigationRail destinations={dests} />);
      assert.ok(railHtml.includes("شريط التنقل الجانبي"));

      const tabsHtml = renderToString(
        <AppTabs
          tabs={[
            { id: "tab1", label: "اليوم" },
            { id: "tab2", label: "الشهر" },
          ]}
          activeTabId="tab1"
          onChange={() => {}}
        />
      );
      assert.ok(tabsHtml.includes("md-tabs"));
      assert.ok(tabsHtml.includes("md-primary-tab"));
      assert.ok(tabsHtml.includes("اليوم"));

      const chipHtml = renderToString(<AppChip label="ألحان الفرايحي" variant="filter" selected />);
      assert.ok(chipHtml.includes("md-filter-chip"));
      assert.ok(chipHtml.includes("ألحان الفرايحي"));
      assert.ok(chipHtml.includes("selected"));
    });
  });

  describe("AppList, AppSnackbar & AppProgressIndicator", () => {
    it("should render lists, snackbars, and progress bars using Material components", () => {
      const listHtml = renderToString(
        <AppList>
          <AppListItem headline="صلاة باكر" supportingText="أجبية" />
        </AppList>
      );
      assert.ok(listHtml.includes("md-list"));
      assert.ok(listHtml.includes("md-list-item"));
      assert.ok(listHtml.includes("صلاة باكر"));

      const snackbarHtml = renderToString(
        <AppSnackbar
          message="تم حفظ التفضيلات"
          isOpen={true}
          onClose={() => {}}
          actionLabel="تراجع"
        />
      );
      assert.ok(snackbarHtml.includes("m3e-snackbar"));
      assert.ok(snackbarHtml.includes("تم حفظ التفضيلات"));

      const progressHtml = renderToString(<AppProgressIndicator variant="linear" value={0.65} />);
      assert.ok(progressHtml.includes("md-linear-progress"));
    });
  });

  describe("Skeleton & Shimmer Loading System", () => {
    it("should render Skeleton, SkeletonText, SkeletonCard, and SkeletonCalendar with M3E skeleton", () => {
      const textHtml = renderToString(<SkeletonText lines={4} />);
      assert.ok(textHtml.includes("m3e-skeleton"));
      assert.ok(textHtml.includes("m3-skeleton-shimmer"));

      const cardHtml = renderToString(<SkeletonCard />);
      assert.ok(cardHtml.includes("rounded-2xl"));
      assert.ok(cardHtml.includes("m3e-skeleton"));

      const calHtml = renderToString(<SkeletonCalendar />);
      assert.ok(calHtml.includes("grid grid-cols-7"));

      const skeletonHtml = renderToString(<Skeleton className="h-6 w-20" />);
      assert.ok(skeletonHtml.includes("m3e-skeleton"));
      assert.ok(skeletonHtml.includes("m3-skeleton-shimmer"));
    });
  });

  describe("Complete UI State Views", () => {
    it("should render EmptyState, ErrorState, OfflineState, and NoResultsState with proper ARIA roles", () => {
      const emptyHtml = renderToString(<EmptyState title="لا توجد ألحان" description="فارغ" />);
      assert.ok(emptyHtml.includes('role="region"'));
      assert.ok(emptyHtml.includes("لا توجد ألحان"));

      const errorHtml = renderToString(<ErrorState message="خطأ في الشبكة" code="NET_500" />);
      assert.ok(errorHtml.includes('role="alert"'));
      assert.ok(errorHtml.includes("NET_500"));

      const offlineHtml = renderToString(<OfflineState />);
      assert.ok(offlineHtml.includes('role="status"'));
      assert.ok(offlineHtml.includes("Offline"));

      const noResultsHtml = renderToString(<NoResultsState query="أغابي" />);
      assert.ok(noResultsHtml.includes("أغابي"));
    });
  });

  describe("Source Provenance Transparency Badge", () => {
    it("should render source provenance badge button with institution name and accessibility label", () => {
      const badgeHtml = renderToString(
        <SourceProvenanceBadge
          sourceId="SRC-CAL-001"
          institution="بطريركية الأقباط الأرثوذكس"
          title="القطمارس السنوي الكنسي"
          edition="طبعة دير السريان 2002"
          referenceLocation="صفحة 14-25"
          sourceCategory="OFFICIAL_CHURCH"
          copyrightOwner="دير السيدة العذراء السريان"
          approvalStatus="معتمد كنسياً رسمياً"
          lastReviewDate="2026-11-17"
        />
      );
      assert.ok(badgeHtml.includes("بطريركية الأقباط الأرثوذكس"));
      assert.ok(
        badgeHtml.includes('aria-label="عرض توثيق المصدر الكنسي: بطريركية الأقباط الأرثوذكس"')
      );
    });
  });

  describe("Expanded Component Suite (UI-REBUILD-01 additions)", () => {
    it("should render FAB and extended FAB with Material Web md-fab", () => {
      const fabHtml = renderToString(<AppFAB icon={<span>+</span>} label="إضافة" extended />);
      assert.ok(fabHtml.includes("md-fab"));
      assert.ok(fabHtml.includes('label="إضافة"'));

      const standardFab = renderToString(
        <FloatingActionButton icon={<span>★</span>} ariaLabel="مفضلة" />
      );
      assert.ok(standardFab.includes("md-fab"));
      assert.ok(standardFab.includes('aria-label="مفضلة"'));
    });

    it("should render NavigationDrawer with items and active indicator", () => {
      const drawerHtml = renderToString(
        <AppNavigationDrawer
          headline={<h3>أنا أرثوذكس</h3>}
          items={[
            { id: "home", label: "الرئيسية", icon: <span>⌂</span>, active: true },
            { id: "cal", label: "السنكسار", icon: <span>📅</span>, badge: "اليوم" },
          ]}
        />
      );
      assert.ok(drawerHtml.includes("الرئيسية"));
      assert.ok(drawerHtml.includes("السنكسار"));
      assert.ok(drawerHtml.includes("اليوم"));
      assert.ok(drawerHtml.includes("bg-[#D7F0E5]"));

      const aliasDrawer = renderToString(
        <NavigationDrawer items={[{ id: "1", label: "عنصر", icon: <span>•</span> }]} />
      );
      assert.ok(aliasDrawer.includes("عنصر"));
    });

    it("should render PasswordField with toggle visibility button and accessible label", () => {
      const pwdHtml = renderToString(
        <AppPasswordField label="كلمة المرور" defaultValue="Secret123" />
      );
      assert.ok(pwdHtml.includes("md-outlined-text-field"));
      assert.ok(pwdHtml.includes('type="password"'));
      assert.ok(pwdHtml.includes('aria-label="إظهار كلمة المرور"'));

      const aliasPwd = renderToString(<PasswordField label="الرقم السري" defaultValue="1234" />);
      assert.ok(aliasPwd.includes("الرقم السري"));
    });

    it("should render Checkbox and Switch with Material Web elements", () => {
      const chkHtml = renderToString(<AppCheckbox label="تذكرني" defaultChecked />);
      assert.ok(chkHtml.includes("md-checkbox"));
      assert.ok(chkHtml.includes("تذكرني"));

      const aliasChk = renderToString(<Checkbox label="موافقة" />);
      assert.ok(aliasChk.includes("md-checkbox"));
      assert.ok(aliasChk.includes("موافقة"));

      const swHtml = renderToString(
        <AppSwitch checked={true} onChange={() => {}} label="الوضع الليلي" />
      );
      assert.ok(swHtml.includes("md-switch"));
      assert.ok(swHtml.includes("selected"));
      assert.ok(swHtml.includes("الوضع الليلي"));

      const aliasSw = renderToString(
        <Switch checked={false} onChange={() => {}} label="التنبيهات" />
      );
      assert.ok(aliasSw.includes("md-switch"));
      assert.ok(aliasSw.includes("التنبيهات"));
    });

    it("should render Divider with Material Web md-divider", () => {
      const divHtml = renderToString(<AppDivider orientation="vertical" />);
      assert.ok(divHtml.includes("md-divider"));

      const aliasDiv = renderToString(<Divider orientation="horizontal" />);
      assert.ok(aliasDiv.includes("md-divider"));
    });

    it("should render AppLogo with authentic brand assets", () => {
      const logoHtml = renderToString(<AppLogo size={48} variant="squircle" />);
      assert.ok(logoHtml.includes("/brand/logo-squircle.png"));
      assert.ok(logoHtml.includes('width="48"'));

      const markHtml = renderToString(<AppLogo size={32} variant="mark" />);
      assert.ok(markHtml.includes("/brand/logo-mark.png"));
    });

    it("should render specialized button and card exports using Material elements", () => {
      const filledBtnHtml = renderToString(<FilledButton>حفظ</FilledButton>);
      assert.ok(filledBtnHtml.includes("md-filled-button"));

      const outlinedBtnHtml = renderToString(<OutlinedButton>إلغاء</OutlinedButton>);
      assert.ok(outlinedBtnHtml.includes("md-outlined-button"));

      const textBtnHtml = renderToString(<TextButton>نص</TextButton>);
      assert.ok(textBtnHtml.includes("md-text-button"));

      const tonalBtnHtml = renderToString(<TonalButton>نغمة</TonalButton>);
      assert.ok(tonalBtnHtml.includes("md-filled-tonal-button"));

      const elevatedBtnHtml = renderToString(<ElevatedButton>مرتفع</ElevatedButton>);
      assert.ok(elevatedBtnHtml.includes("md-elevated-button"));

      const elevatedCardHtml = renderToString(<ElevatedCard>محتوى</ElevatedCard>);
      assert.ok(elevatedCardHtml.includes("m3e-card"));
      assert.ok(elevatedCardHtml.includes('variant="elevated"'));

      const filledCardHtml = renderToString(<FilledCard>محتوى معبأ</FilledCard>);
      assert.ok(filledCardHtml.includes("m3e-card"));
      assert.ok(filledCardHtml.includes('variant="filled"'));

      const outlinedCardHtml = renderToString(<OutlinedCard>محتوى</OutlinedCard>);
      assert.ok(outlinedCardHtml.includes("m3e-card"));
      assert.ok(outlinedCardHtml.includes('variant="outlined"'));

      const iconBtnHtml = renderToString(<IconButton aria-label="أيقونة">★</IconButton>);
      assert.ok(iconBtnHtml.includes("md-icon-button"));
      assert.ok(iconBtnHtml.includes('aria-label="أيقونة"'));
    });
  });
});
