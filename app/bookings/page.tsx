import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "@/app/_components/ui/page";

export default async function BookingsPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <PageSection>
          <PageSectionTitle>Meus Agendamentos</PageSectionTitle>
          <p className="text-muted-foreground">
            Você não tem agendamentos no momento.
          </p>
        </PageSection>
      </PageContainer>
      <Footer />
    </>
  );
}
