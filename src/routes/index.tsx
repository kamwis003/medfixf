import { AppLayout } from '@/components/app-layout'
import { NotFound } from '@/pages/not-found'
import { GuestRoute } from './guest-route'
import { ProtectedRoute } from './protected-route'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { TermsOfServicePage } from '@/pages/terms-of-service-page'
import { PrivacyPolicyPage } from '@/pages/privacy-policy-page'
import { LoginPage } from '@/pages/login-page'
import { RegisterPage } from '@/pages/register-page'
import { ROUTES } from './paths'
import { ForgotPasswordPage } from '@/pages/forgot-password-page'
import { UpdatePasswordPage } from '@/pages/update-password-page'
import { PaymentSuccessPage } from '@/pages/payment-success-page'
import { PaymentCancelledPage } from '@/pages/payment-cancelled-page'
import { AccountPage } from '@/pages/account/account-page'
import { BillingPage } from '@/pages/billing/billing-page'
import { ProductsPage } from '@/pages/products/products-page'
import { ProductDetailPage } from '@/pages/products/product-detail-page'
import { HomeRedirect } from '@/pages/home-redirect'
import { UserRoute } from '@/routes/user-route'
import { EndometriosisInfo } from '@/pages/modules/endometriosis/endometriosis-info'
import { EndometriosisDiary } from '@/pages/modules/endometriosis/endometriosis-diary'
import { EndometriosisVisualization } from '@/pages/modules/endometriosis/endometriosis-visualization'
import { EndometriosisAdvice } from '@/pages/modules/endometriosis/endometriosis-advice'
import { EndometriosisArticleEditor } from '@/pages/modules/endometriosis/endometriosis-article-editor'
import { CycleCalendar } from '@/pages/modules/fertility/cycle-calendar'
import { CycleTracking } from '@/pages/modules/fertility/cycle-tracking'
import { FertilityEducation } from '@/pages/modules/fertility/education'
import { ConsultationRequest } from '@/pages/modules/consultation-request'
import { PatientsPage } from '@/pages/modules/patients'
import { PatientDetailPage } from '@/pages/modules/patient-detail'
import { MyRequestsPage } from '@/pages/modules/my-requests'
import { ClinicRequestsPage } from '@/pages/modules/clinic-requests'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
          },
          {
            path: ROUTES.REGISTER,
            element: <RegisterPage />,
          },
          {
            path: ROUTES.FORGOT_PASSWORD,
            element: <ForgotPasswordPage />,
          },
          {
            path: ROUTES.UPDATE_PASSWORD,
            element: <UpdatePasswordPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <HomeRedirect /> },
              {
                path: 'products',
                children: [
                  {
                    index: true,
                    element: <Navigate to={ROUTES.PRODUCTS.MY} replace />,
                  },
                  {
                    element: <UserRoute />,
                    children: [
                      {
                        path: 'catalog',
                        children: [
                          {
                            index: true,
                            element: <ProductsPage />,
                          },
                          {
                            path: ':slug',
                            element: <ProductDetailPage />,
                          },
                        ],
                      },
                      {
                        path: 'my',
                        element: <ProductsPage />,
                      },
                    ],
                  },
                ],
              },
              {
                path: 'account',
                element: <AccountPage />,
              },
              {
                path: 'billing',
                element: <BillingPage />,
              },
              {
                path: 'payment-success',
                element: <PaymentSuccessPage />,
              },
              {
                path: 'payment-cancelled',
                element: <PaymentCancelledPage />,
              },
              {
                path: 'modules',
                children: [
                  {
                    path: 'endometriosis',
                    children: [
                      {
                        path: 'endometriosis-info',
                        element: <EndometriosisInfo />,
                      },
                      {
                        path: 'endometriosis-diary',
                        element: <EndometriosisDiary />,
                      },
                      {
                        path: 'endometriosis-visualization',
                        element: <EndometriosisVisualization />,
                      },
                      {
                        path: 'endometriosis-advice',
                        element: <EndometriosisAdvice />,
                      },
                      {
                        path: 'endometriosis-info/new',
                        element: <EndometriosisArticleEditor />,
                      },
                    ],
                  },
                  {
                    path: 'fertility',
                    children: [
                      {
                        path: 'cycle-calendar',
                        element: <CycleCalendar />,
                      },
                      {
                        path: 'cycle-tracking',
                        element: <CycleTracking />,
                      },
                      {
                        path: 'education',
                        element: <FertilityEducation />,
                      },
                    ],
                  },
                  {
                    path: 'consultation-request',
                    element: <ConsultationRequest />,
                  },
                  {
                    path: 'patients',
                    children: [
                      { index: true, element: <PatientsPage /> },
                      { path: ':id', element: <PatientDetailPage /> },
                    ],
                  },
                  {
                    path: 'my-requests',
                    element: <MyRequestsPage />,
                  },
                  {
                    path: 'clinic-requests',
                    element: <ClinicRequestsPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: ROUTES.TERMS_OF_SERVICE,
        element: <TermsOfServicePage />,
      },
      {
        path: ROUTES.PRIVACY_POLICY,
        element: <PrivacyPolicyPage />,
      },
    ],
  },
])
