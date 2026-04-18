import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {
  buildInventorySummary,
  InventoryItem,
  searchInventory,
} from "@/services/inventoryApi";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { t } from "../locales/translations";
import { createGlobalStyles } from "../styles/createGlobalStyles";

function formatMoney(value: number) {
  return value.toLocaleString("es-DO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function ServiceBadge({
  label,
  value,
  colors,
  styles,
}: {
  label: string;
  value: string;
  colors: any;
  styles: any;
}) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeValue}>{value}</Text>
    </View>
  );
}

function ArticleCard({
  item,
  colors,
  styles,
  language,
}: {
  item: InventoryItem;
  colors: any;
  styles: any;
  language: any;
}) {
  return (
    <View style={styles.articleCard}>
      <View style={{ flexDirection: "row", gap: 14 }}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              backgroundColor: "#0E1F31",
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.articleImagePlaceholder}>
            <Ionicons name="image-outline" size={32} color={colors.primary} />
          </View>
        )}

        <View style={styles.articleInfo}>
          <Text style={styles.articleName}>{item.name}</Text>

          <View style={styles.articleMetaRow}>
            <Text style={styles.articleMetaText}>
              {t(language, "units")}: {item.units}
            </Text>
            <Text style={styles.articleMetaText}>
              {t(language, "price")}: RD$ {formatMoney(item.price)}
            </Text>
          </View>

          <View style={styles.articleMetaRow}>
            <Text style={styles.articleMetaText}>
              {t(language, "cost")}: RD$ {formatMoney(item.cost)}
            </Text>
            <Text style={styles.articleBenefit}>
              {t(language, "benefit")}: RD$ {formatMoney(item.benefit)}
            </Text>
          </View>

          <Text style={styles.articleStock}>{item.stockText}</Text>
        </View>
      </View>
    </View>
  );
}

export default function TaskInventoryScreen() {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const [wifiStatus, setWifiStatus] = useState(t(language, "notVerified"));
  const [internetStatus, setInternetStatus] = useState(
    t(language, "notVerified"),
  );
  const [locationStatus, setLocationStatus] = useState(
    t(language, "notVerified"),
  );
  const [bluetoothStatus, setBluetoothStatus] = useState(
    t(language, "requiresDevBuild"),
  );

  const summary = useMemo(() => buildInventorySummary(items), [items]);

  const checkInternetBeforeSearch = async () => {
    const state = await NetInfo.fetch();
    const connected = !!state.isConnected && !!state.isInternetReachable;
    const wifi = state.type === "wifi";
    const cellular = state.type === "cellular";

    setWifiStatus(wifi ? t(language, "active") : t(language, "inactive"));
    setInternetStatus(
      connected
        ? wifi
          ? t(language, "connectedViaWifi")
          : cellular
            ? t(language, "connectedViaCellular")
            : t(language, "connected")
        : t(language, "noConnectionShort"),
    );

    if (!connected) {
      Alert.alert(
        t(language, "noConnectionTitle"),
        t(language, "noConnectionMessage"),
      );
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      Alert.alert(
        t(language, "searchRequired"),
        t(language, "searchRequiredMessage"),
      );
      return;
    }
    const hasInternet = await checkInternetBeforeSearch();
    if (!hasInternet) return;

    try {
      setLoading(true);
      const result = await searchInventory(trimmed);
      setItems(result);
    } catch (error: any) {
      Alert.alert(
        t(language, "error"),
        error?.message ?? t(language, "apiError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDeviceServices = async () => {
    const state = await NetInfo.fetch();
    const connected = !!state.isConnected && !!state.isInternetReachable;
    const wifi = state.type === "wifi";
    const cellular = state.type === "cellular";

    setWifiStatus(wifi ? t(language, "active") : t(language, "inactive"));
    setInternetStatus(
      connected
        ? wifi
          ? t(language, "connectedViaWifi")
          : cellular
            ? t(language, "connectedViaCellular")
            : t(language, "connected")
        : t(language, "noConnectionShort"),
    );

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationStatus(t(language, "permissionDenied"));
      } else {
        const enabled = await Location.hasServicesEnabledAsync();
        setLocationStatus(
          enabled ? t(language, "active") : t(language, "inactive"),
        );
      }
    } catch {
      setLocationStatus(t(language, "notAvailable"));
    }

    setBluetoothStatus(t(language, "requiresDevBuild"));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topSpace} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ArticleCard
              item={item}
              colors={colors}
              styles={styles}
              language={language}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <>
              <View style={styles.headerRow}>
                <Pressable
                  style={[styles.iconButton, { marginRight: 12 }]}
                  onPress={() => router.back()}
                >
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color={colors.primary}
                  />
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>
                    {t(language, "inventoryAPI")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t(language, "independentScreen")}
                  </Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                  {t(language, "articleSearch")}
                </Text>
                <View style={styles.inputRow}>
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={t(language, "describeItem")}
                    placeholderTextColor="#8AA0B8"
                    style={styles.input}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                  />
                  <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons
                      name="search"
                      size={22}
                      color={colors.background}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                  {t(language, "deviceStatus")}
                </Text>
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
                >
                  <ServiceBadge
                    label={t(language, "wifi")}
                    value={wifiStatus}
                    colors={colors}
                    styles={styles}
                  />
                  <ServiceBadge
                    label={t(language, "internet")}
                    value={internetStatus}
                    colors={colors}
                    styles={styles}
                  />
                </View>
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
                >
                  <ServiceBadge
                    label={t(language, "location")}
                    value={locationStatus}
                    colors={colors}
                    styles={styles}
                  />
                  <ServiceBadge
                    label={t(language, "bluetooth")}
                    value={bluetoothStatus}
                    colors={colors}
                    styles={styles}
                  />
                </View>
                <Pressable
                  style={styles.statusButton}
                  onPress={handleCheckDeviceServices}
                >
                  <Text style={styles.statusButtonText}>
                    {t(language, "checkServices")}
                  </Text>
                </Pressable>
              </View>

              {items.length === 0 && !loading && (
                <Text style={styles.emptyText}>{t(language, "noResults")}</Text>
              )}
            </>
          }
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginTop: 20, alignSelf: "center" }}
              />
            ) : null
          }
        />
      </KeyboardAvoidingView>

      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => setSummaryVisible(true)}
        >
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            {t(language, "showSummary")}
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={summaryVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSummaryVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t(language, "querySummary")}</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t(language, "itemsLoaded")}
              </Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t(language, "totalPrice")}
              </Text>
              <Text style={styles.summaryValue}>
                RD$ {formatMoney(summary.totalPrice)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t(language, "totalCost")}
              </Text>
              <Text style={styles.summaryValue}>
                RD$ {formatMoney(summary.totalCost)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t(language, "totalInventory")}
              </Text>
              <Text style={styles.summaryValue}>{summary.totalUnits}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t(language, "totalBenefit")}
              </Text>
              <Text style={styles.summaryValue}>
                RD$ {formatMoney(summary.totalBenefit)}
              </Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => setSummaryVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t(language, "close")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
