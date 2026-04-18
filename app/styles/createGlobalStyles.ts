import { StyleSheet } from "react-native";
import { border, fontSize, fontWeight, radius, spacing } from "./theme";

export function createGlobalStyles(colors: {
    background: string;
    primary: string;
    text: string;
    secondaryText: string;
    card: string;
}) {
    return StyleSheet.create({
        // ========== ESTILOS BASE ==========
        screen: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
        },
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        topSpace: {
            paddingTop: spacing.xxxl,
        },
        topSpaceLarge: {
            paddingTop: 40, // spacing.huge si lo defines en theme
        },
        contentContainer: {
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
            // paddingBottom se define en cada pantalla (por ejemplo 24)
        },

        // ========== TEXTO Y CABECERAS ==========
        title: {
            color: colors.text,
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            marginBottom: spacing.sm,
        },
        subtitle: {
            color: colors.secondaryText,
            fontSize: fontSize.sm,
            marginBottom: spacing.sm,
        },
        sectionTitle: {
            color: colors.text,
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            marginBottom: spacing.md,
        },
        footerTitle: {
            color: colors.text,
            fontSize: fontSize.xl,
            fontWeight: fontWeight.bold,
            marginTop: spacing.xl,
            marginBottom: spacing.md,
        },

        // ========== TARJETAS Y CONTENEDORES ==========
        card: {
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            borderWidth: border.width,
            borderColor: border.color,
        },
        sectionCard: {
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: border.width,
            borderColor: border.color,
            padding: spacing.md,
            marginBottom: spacing.md,
        },
        userCard: {
            backgroundColor: colors.card,
            borderWidth: border.width,
            borderColor: border.color,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        badge: {
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: border.width,
            borderColor: border.color,
            padding: spacing.md,
        },
        articleCard: {
            backgroundColor: colors.card,
            borderRadius: radius.xxl,
            borderWidth: border.width,
            borderColor: border.color,
            padding: spacing.lg,
            marginBottom: spacing.md,
        },
        modalCard: {
            backgroundColor: colors.card,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            padding: spacing.xl,
            borderTopWidth: border.width,
            borderColor: border.color,
        },

        // ========== FILAS Y LISTAS ==========
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.xl,
        },
        inputRow: {
            flexDirection: "row",
            gap: spacing.md,
            alignItems: "center",
        },
        list: {
            gap: spacing.sm,
        },
        grid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: spacing.md,
        },
        summaryRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: spacing.lg,
        },
        articleMetaRow: {
            flexDirection: "row",
            gap: spacing.md,
            marginBottom: spacing.xs,
        },

        // ========== TEXTOS DENTRO DE TARJETAS ==========
        label: {
            color: colors.text,
            fontSize: fontSize.sm,
            fontWeight: fontWeight.semibold,
            marginBottom: 6,
            marginTop: spacing.sm,
        },
        userName: {
            color: colors.text,
            fontWeight: fontWeight.bold,
        },
        userEmail: {
            color: colors.secondaryText,
            fontSize: fontSize.xs,
            marginTop: spacing.xs,
        },
        emailText: {
            color: colors.secondaryText,
            marginBottom: spacing.lg,
            fontSize: fontSize.sm,
        },
        articleName: {
            color: colors.text,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.md,
            marginBottom: 6,
        },
        articleMetaText: {
            color: colors.secondaryText,
            fontSize: fontSize.sm,
        },
        articleBenefit: {
            color: colors.primary,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.sm,
        },
        articleStock: {
            color: colors.secondaryText,
            fontSize: fontSize.xs,
            marginTop: 6,
        },
        badgeLabel: {
            color: colors.secondaryText,
            fontSize: fontSize.xs,
            marginBottom: spacing.xs,
        },
        badgeValue: {
            color: colors.text,
            fontSize: fontSize.sm,
            fontWeight: fontWeight.bold,
        },
        summaryLabel: {
            color: colors.secondaryText,
            fontSize: fontSize.md,
        },
        summaryValue: {
            color: colors.text,
            fontSize: fontSize.md,
            fontWeight: fontWeight.bold,
        },
        emptyText: {
            color: colors.secondaryText,
            textAlign: "center",
            marginTop: 40, // spacing.huge
            fontSize: fontSize.sm,
        },
        moodCardTitle: {
            color: colors.text,
            fontSize: fontSize.md,
            fontWeight: fontWeight.bold,
            marginBottom: spacing.xs,
            textAlign: "center",
        },
        moodCardDescription: {
            color: colors.secondaryText,
            fontSize: fontSize.xs,
            textAlign: "center",
            lineHeight: 16,
        },

        // ========== BOTONES ==========
        actionButton: {
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: spacing.md,
        },
        primaryButton: {
            backgroundColor: colors.primary,
        },
        secondaryButton: {
            borderColor: colors.primary,
            borderWidth: border.width,
        },
        tertiaryButton: {
            borderColor: border.softColor,
            borderWidth: border.width,
            backgroundColor: colors.card,
        },
        sendButton: {
            backgroundColor: colors.primary,
            borderRadius: radius.sm,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
        },
        sendButtonDisabled: {
            opacity: 0.55,
        },
        acceptButton: {
            borderRadius: radius.sm,
            borderWidth: border.width,
            borderColor: colors.primary,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            backgroundColor: `${colors.primary}1F`, // ~12% opacidad
        },
        closeButton: {
            marginTop: spacing.xl,
            backgroundColor: colors.primary,
            borderRadius: radius.md,
            paddingVertical: spacing.md,
            alignItems: "center",
        },
        searchButton: {
            width: 48,
            height: 48,
            borderRadius: radius.md,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
        },
        statusButton: {
            marginTop: spacing.sm,
            backgroundColor: "rgba(163,255,18,0.12)",
            borderWidth: border.width,
            borderColor: colors.primary,
            borderRadius: radius.md,
            alignItems: "center",
            paddingVertical: spacing.md,
        },
        continueButtonText: {
            color: colors.background,
            fontSize: 16,
            fontWeight: fontWeight.extrabold,
        },
        actionText: {
            fontSize: fontSize.md,
            fontWeight: fontWeight.extrabold,
        },
        primaryButtonText: {
            color: colors.background,
        },
        secondaryButtonText: {
            color: colors.primary,
        },
        tertiaryButtonText: {
            color: colors.text,
        },
        sendButtonText: {
            color: colors.background,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.xs,
        },
        acceptButtonText: {
            color: colors.primary,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.xs,
        },
        statusButtonText: {
            color: colors.primary,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.md,
        },
        closeButtonText: {
            color: colors.background,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.md,
        },

        // ========== COMPONENTES VISUALES ==========
        iconButton: {
            width: 44,
            height: 44,
            borderRadius: radius.xl,
            backgroundColor: colors.card,
            borderWidth: border.width,
            borderColor: border.color,
            alignItems: "center",
            justifyContent: "center",
        },
        input: {
            backgroundColor: colors.background,
            borderWidth: border.width,
            borderColor: border.color,
            color: colors.text,
            borderRadius: radius.md,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: spacing.md,
        },
        segmentedContainer: {
            flexDirection: "row",
            backgroundColor: colors.background,
            borderRadius: radius.md,
            borderWidth: border.width,
            borderColor: border.color,
            padding: 4,
            marginTop: 6,
        },
        segmentButton: {
            flex: 1,
            borderRadius: radius.sm,
            paddingVertical: 10,
            alignItems: "center",
        },
        segmentButtonActive: {
            backgroundColor: colors.primary,
        },
        segmentText: {
            color: colors.secondaryText,
            fontWeight: fontWeight.semibold,
        },
        segmentTextActive: {
            color: colors.background,
            fontWeight: fontWeight.bold,
        },
        friendBadge: {
            borderRadius: radius.pill,
            borderWidth: border.width,
            borderColor: colors.primary,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            backgroundColor: `${colors.primary}1F`,
        },
        friendBadgeText: {
            color: colors.primary,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.xs,
        },
        moodCard: {
            width: "48%",
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: border.width,
            borderColor: border.color,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.md,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
        },
        moodCardSelected: {
            borderColor: colors.primary,
        },
        moodIconCircle: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#0E1F31",
            borderWidth: border.width,
            borderColor: "#2A4360",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.sm,
        },
        moodIcon: {
            fontSize: 24,
        },
        articleImagePlaceholder: {
            width: 80,
            height: 80,
            borderRadius: radius.lg,
            backgroundColor: "#0E1F31",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: border.width,
            borderColor: "#2A4360",
        },
        articleInfo: {
            flex: 1,
        },

        // ========== MODALES Y BARRAS ==========
        modalBackdrop: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
        },
        bottomBar: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
            borderTopWidth: border.width,
            borderTopColor: border.color,
        },
        // ========== ESTILOS PARA ROUTINES SCREEN ==========

        space: {
            paddingTop: spacing.xxxl, // 30
        },

        createButton: {
            backgroundColor: colors.primary,
            borderRadius: radius.md,   // 12
            paddingHorizontal: spacing.md, // 12
            paddingVertical: spacing.sm,   // 8
        },
        createButtonText: {
            color: colors.background,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.sm, // 13
        },

        routineList: {
            gap: spacing.md, // 12
        },

        routineCard: {
            backgroundColor: colors.card,
            borderRadius: radius.lg, // 16
            borderWidth: border.width,
            borderColor: border.color,
            overflow: "hidden",
            flexDirection: "row",
            shadowColor: "#000",
            shadowOpacity: 0.22,
            shadowRadius: 9,
            shadowOffset: { width: 0, height: 5 },
            elevation: 3,
        },
        routineCardAccent: {
            width: 6,
            backgroundColor: colors.primary,
        },
        routineCardContent: {
            padding: spacing.md, // 14
            flex: 1,
        },
        routineCardTitle: {
            color: colors.text,
            fontSize: fontSize.lg, // 16 (pero original 18, puedes usar fontSize.xl=20? mejor usar 18: crea fontSize.lg2 si quieres exacto. Usaremos fontSize.lg (16) o añade uno nuevo. Para mantener consistencia, usaremos fontSize.lg y fontWeight bold)
            fontWeight: fontWeight.bold,
            marginBottom: 6,
        },
        routineCardMeta: {
            color: colors.secondaryText,
            fontSize: fontSize.sm, // 13
        },
        routineCardCreator: {
            color: colors.primary,
            fontSize: fontSize.sm,
            marginTop: spacing.sm,
            fontWeight: fontWeight.semibold,
        },
        routineParticipantsLabel: {
            color: colors.secondaryText,
            fontSize: fontSize.sm,
            marginTop: spacing.sm,
        },
        // ========== ESTILOS PARA HOME SCREEN ==========

        homeContent: {
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.lg,     // 16
            // paddingBottom se define en la pantalla (120)
        },

        avatarPlaceholder: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.card,
            borderWidth: border.width,
            borderColor: border.color,
            alignItems: "center",
            justifyContent: "center",
        },
        avatarText: {
            color: colors.primary,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.lg, // 16
        },

        sectionHeader: {
            marginBottom: spacing.sm, // 8
        },
        homeSectionTitle: {
            color: colors.text,
            fontSize: fontSize.xl, // 20
            fontWeight: fontWeight.bold,
        },

        exerciseList: {
            gap: spacing.sm, // 8 (pero original 10, puedes usar spacing.md=12 o dejar 10 con valor fijo)
            // si quieres exactamente 10, usa gap: 10,
        },

        homeFooter: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.sm, // 8 (original 10)
            paddingBottom: spacing.xl,
            backgroundColor: colors.background,
        },

        routineButton: {
            backgroundColor: "#8AA0B8",
            paddingVertical: spacing.md, // 12
            borderRadius: radius.md,     // 12
            alignItems: "center",
            marginTop: spacing.xl,       // 20
            marginBottom: spacing.xl,
            paddingHorizontal: spacing.lg, // 16
        },
        routineButtonText: {
            color: "#0B1A2A",
            fontWeight: fontWeight.bold,
            fontSize: fontSize.md, // 15 (o 16 si quieres)
        },

        progressCard: {
            backgroundColor: colors.card,
            borderRadius: radius.lg, // 16 (pero original 18, usa radius.xl=22 o deja 18 con número fijo)
            padding: spacing.lg,
            marginBottom: spacing.xl,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 4,
        },
        progressTitle: {
            color: colors.text,
            fontSize: fontSize.lg, // 16 (original 18, usa fontSize.xl=20 si quieres)
            fontWeight: fontWeight.bold,
            marginBottom: spacing.md,
        },
        progressBarBackground: {
            height: 12,
            width: "100%",
            borderRadius: radius.pill,
            backgroundColor: "#1C3349",
            overflow: "hidden",
            marginBottom: spacing.sm,
        },
        progressBarFill: {
            height: "100%",
            borderRadius: radius.pill,
            backgroundColor: colors.primary,
        },
        progressText: {
            color: colors.secondaryText,
            fontSize: fontSize.sm,
        },

        exerciseCard: {
            backgroundColor: colors.card,
            borderRadius: radius.md,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.md,
            borderWidth: border.width,
            borderColor: border.color,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        exerciseName: {
            color: colors.text,
            fontSize: fontSize.md,
            fontWeight: fontWeight.bold,
        },
        exerciseMeta: {
            color: colors.secondaryText,
            fontSize: fontSize.sm,
            marginTop: spacing.xs,
        },
        exerciseStatusBadge: {
            borderRadius: radius.pill,
            paddingHorizontal: spacing.sm,
            paddingVertical: 6,
            borderWidth: border.width,
        },
        exerciseStatusBadgeCompleted: {
            backgroundColor: `${colors.primary}2E`, // 18% opacidad
            borderColor: `${colors.primary}80`,     // 50% opacidad
        },
        exerciseStatusBadgePending: {
            backgroundColor: "#1F2F41",
            borderColor: "#36506E",
        },
        exerciseStatusText: {
            fontSize: fontSize.xs,
            fontWeight: fontWeight.bold,
        },
        exerciseStatusTextCompleted: {
            color: colors.primary,
        },
        exerciseStatusTextPending: {
            color: "#BFD0E1",
        },
        // ========== ESTILOS PARA TAB LAYOUT ==========

        tabBar: {
            backgroundColor: colors.card,
            borderTopColor: colors.background,
        },
        // ========== ESTILOS PARA ONBOARDING ==========

        titleMedium: {
            color: colors.text,
            fontSize: 26,
            fontWeight: fontWeight.bold,
            marginBottom: spacing.xl, // 20
        },

        inputCompact: {
            backgroundColor: colors.background,
            borderWidth: border.width,
            borderColor: border.color,
            color: colors.text,
            borderRadius: 10,
            padding: 12, // padding uniforme
            marginBottom: spacing.md,
        },

        flexFill: {
            flex: 1,
        },
        row: {
            flexDirection: "row",
            gap: spacing.xl, // 20
            marginTop: spacing.sm, // 8
        },

        segmentButtonCompact: {
            borderRadius: radius.sm,
            paddingVertical: 6,
            paddingHorizontal: 12,
            alignItems: "center",
        },
        listItem: {
            paddingVertical: spacing.md, // 12
            marginBottom: spacing.sm,    // 8
            borderBottomWidth: border.width,
            borderBottomColor: border.color,
        },
        listItemText: {
            color: colors.text,
            fontSize: fontSize.md, // 15 (o 16 si prefieres)
        },

        // ========== ESTILO PARA PANTALLAS CENTRADAS ==========
        centeredContainer: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl, // 20
        },

        // ========== ESTILOS PARA WORKOUT ==========
        workoutExerciseItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: spacing.sm,
            borderBottomWidth: border.width,
            borderBottomColor: border.color,
        },
        workoutExerciseName: {
            color: colors.text,
            fontSize: fontSize.md,
            fontWeight: fontWeight.bold,
        },
        workoutExerciseDetails: {
            color: colors.secondaryText,
            fontSize: fontSize.sm,
            marginTop: 2,
        },
        workoutExerciseStatus: {
            width: 30,
            alignItems: "center",
        },
        workoutCompleted: {
            color: colors.primary,
            fontSize: 20,
            fontWeight: fontWeight.bold,
        },
        workoutPending: {
            color: colors.secondaryText,
            fontSize: 20,
        },
        modalTitle: {
            color: colors.text,
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            marginBottom: spacing.xl,
        },

        // ========== WORKOUT STYLES ==========

        videoPlaceholder: {
            width: "100%",
            height: 200,
            backgroundColor: "#0E1F31",
            borderRadius: radius.lg,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
            borderWidth: border.width,
            borderColor: border.color,
        },
        // ========== ESTILOS PARA PANTALLAS DE AUTENTICACIÓN ==========
        errorText: {
            color: "#FF7373",
            marginBottom: spacing.sm,
            fontSize: fontSize.sm,
        },
        linkText: {
            color: colors.primary,
            textAlign: "center",
            marginTop: spacing.lg,
        },
        successText: {
            color: "#6BFF9A",
            marginBottom: spacing.sm,
            fontSize: fontSize.sm,
        },
        // ========== ESTILOS PARA FORMULARIOS ==========
        formContainer: {
            flex: 1,
            backgroundColor: colors.background,
            padding: spacing.xl,
            justifyContent: "center",
        },
    });
}