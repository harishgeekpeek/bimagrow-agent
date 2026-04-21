import { useSearch } from "@/src/context/SearchContext";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    RefreshControl,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager,
    Linking,
} from "react-native";
import {
    CalendarDotsIcon,
    CaretDownIcon,
    CaretUpIcon,
    DownloadSimpleIcon,
    ReadCvLogoIcon,
    TrendDownIcon,
    TrendUpIcon,
    UserCircleIcon,
} from "phosphor-react-native";
import { useToast } from "@/components/ui/toast";
import { downloadStatement, getLedgerDetails } from "@/src/api/ledgerApi";
import { Divider } from "@/components/ui/divider";
import { formatAmount, formatDate, formatToYYYYMMDD } from "@/src/helper/helper";
import { showAppToast } from "@/utils/toastUtils";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { generatePDF } from 'react-native-html-to-pdf';
// import RNFS from 'react-native-fs';
import * as RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { PermissionsAndroid } from "react-native";




if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const accordionColors = [
    "#F1ECFD",
    "#FEE5D9",
    "#C9E6F8",
    "#EFFFE1",
];
const accordionIconBg = [
    "#E4D8FF",
    "#FFCAB0",
    "#94D2FF",
    "#DEF3A1",
];
export default function MyAdvisor() {
    const toast = useToast();
    const { search } = useSearch();
    const { id } = useLocalSearchParams();

    const [statement, setStatement] = useState<any[]>([]);
    const [downloadData, setDownloadData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [totalCount, setTotalCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false)
    const [pickerMode, setPickerMode] = useState<"from" | "to">("from");
    const [pickerVisible, setPickerVisible] = useState(false);

    const today = new Date();

    // 1st day of current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [fromDate, setFromDate] = useState<Date | null>(firstDayOfMonth);
    const [toDate, setToDate] = useState<Date | null>(today);


    const fetchLedgerDetail = async (
        isLoadMore = false,
        customOffset?: number,
    ) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true)
            } else {
                setLoading(true);
            }

            const finalOffset = customOffset ?? offset;

            // const res = await getLedgerDetails(id, search, finalOffset, limit);    //paginated
            const res = await getLedgerDetails(id, search);

            if (res?.status) {
                setTotalCount(res.count);

                if (isLoadMore) {
                    setStatement(prev => [...prev, ...res.data]);
                } else {
                    setStatement(res.data);
                }
            }
        } catch (error) {
            console.log("Error fetching statement:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setOffset(0);
            setExpandedId(null);
            fetchLedgerDetail(false, 0);
        }, [])
    );
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (search !== undefined) {
            const delay = setTimeout(() => {
                setOffset(0);
                setExpandedId(null);
                fetchLedgerDetail(false, 0);
            }, 500);

            return () => clearTimeout(delay);
        }
    }, [search]);

    const onRefresh = async () => {
        setRefreshing(true);
        setOffset(0);
        setExpandedId(null);
        await fetchLedgerDetail(false, 0);
    };

    const handleLoadMore = async () => {
        const newOffset = statement.length;
        setOffset(newOffset);
        await fetchLedgerDetail(true, newOffset);
    };

    const hasMore = statement.length < totalCount;

    const SkeletonItem = () => (
        <View className="min-h-[70px] flex-row gap-2 my-[10px] rounded-[12px] bg-[#ffffff14] p-4">
            <View className="bg-[#ffffff14] h-[42px] w-[42px] rounded-[8px]" />
            <View className="flex-1">
                <View className="h-[20px] w-1/2 bg-[#ffffff14] rounded mb-2" />
                <View className="h-[15px] w-full bg-[#ffffff14] rounded" />
            </View>
        </View>
    );

    const formatDescription = (desc: any) => {
        if (!desc) return '—';

        try {
            const parsed = JSON.parse(desc);

            if (typeof parsed === 'object' && parsed !== null) {
                return Object.entries(parsed)
                    .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
                    .join('\n');
            }

            return parsed;
        } catch (e) {
            return desc;
        }
    };

    const renderItem = ({ item, index }: any) => {
        const isExpanded = expandedId === item?.id;
        const bgColor = accordionColors[index % accordionColors.length];
        const iconBg = accordionIconBg[index % accordionIconBg.length]
        return (
            <View
                style={{ backgroundColor: bgColor }}
                className="min-h-[70px] my-[10px] justify-center rounded-[12px]"
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        LayoutAnimation.configureNext(
                            LayoutAnimation.Presets.easeInEaseOut
                        );
                        setExpandedId(prev =>
                            prev === item.id ? null : item.id
                        );
                    }}
                    className="p-3"
                >
                    <View className="flex-row items-center p-[5px] gap-2">
                        <View className="bg-white h-[42px] w-[42px]  items-center justify-center rounded-[8px]">
                            <UserCircleIcon size={40} weight="fill" color="#000" />
                        </View>

                        <View className="flex-1 gap-1">
                            <Text ellipsizeMode="tail" className="text-black text-[16px] leading-none capitalize font-biorhyme-semibold">{item?.name ? String(item?.name).toLocaleLowerCase() : 'N/A'}</Text>
                            <Text ellipsizeMode="tail" className="text-[#6C6060] text-[12px] leading-none font-kanit">{item?.ledger_type || ''}</Text>
                        </View>

                        <Text className={`text-[14px] font-kanit ${item?.type == 'credit' ? 'text-[#008000]' : 'text-[#FF0000]'}`}>
                            {`${item?.type == 'credit' ? '+' : '-'}₹${formatAmount(item?.amount)}/-`}
                        </Text>

                        <View className="w-[18px] h-[18px] border-[1px] border-[#6C6060] items-center justify-center rounded-[5px] ">
                            {isExpanded ? (
                                <CaretUpIcon size={14} color="#6C6060" />
                            ) : (
                                <CaretDownIcon size={14} color="#6C6060" />
                            )}
                        </View>
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View className="px-4 pb-3">
                        <View className="flex-row items-center justify-between gap-2 mb-[5px]">
                            <Text className="text-[#6C6060] text-[14px] font-kanit">{formatDescription(item?.description)}</Text>
                        </View>
                        <View className="flex-row items-center justify-between gap-2 mb-[5px]">
                            <View className="flex-1">
                                <Divider className="bg-[#A3A3A3]" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[#6C6060] text-[12px] font-kanit">Transaction Details</Text>
                            </View>
                            <View className="flex-1">
                                <Divider className="bg-[#A3A3A3]" />
                            </View>
                        </View>
                        <View className="flex-row items-center justify-between gap-2 mb-[5px]">
                            <View className="flex-row items-center gap-[5px] justify-center">
                                <CalendarDotsIcon size={16} weight="light" color="#6C6060" />
                                <Text className="text-[#6C6060] text-[14px] font-kanit-light  mb-[1px]">{formatDate(item?.ledgerdate)}</Text>
                            </View>
                            <Text className={`text-[14px] font-kanit ${item?.type == 'credit' ? 'text-[#008000]' : 'text-[#FF0000]'}`}>
                                {`${item?.type == 'credit' ? '+' : '-'}₹${formatAmount(item?.amount)}/-`}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between gap-2 mb-[5px]">
                            <View className="flex-row items-center gap-[5px] justify-center">
                                <ReadCvLogoIcon size={16} weight="light" color="#6C6060" />
                                <Text className="text-[#6C6060] text-[14px] font-kanit-light  mb-[1px]">{item?.amount_type || '-'}</Text>
                            </View>
                            <Text className={`text-[14px] font-kanit ${item?.type == 'credit' ? 'text-[#008000]' : 'text-[#FF0000]'}`}>
                                {`${item?.type == 'credit' ? '+' : '-'}₹${formatAmount(item?.amount)}/-`}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between gap-2 mb-[5px]">
                            <View className="flex-row items-center gap-[5px] justify-center">
                                <View className="w-[16px] h-[16px] items-center justify-center rounded-full" style={{ backgroundColor: iconBg }}>
                                    {item?.type == 'credit' ? (
                                        <TrendUpIcon size={12} weight="light" color={item?.type == 'credit' ? '#008000' : '#FF0000'} />
                                    ) : (
                                        <TrendDownIcon size={12} weight="light" color={item?.type == 'credit' ? '#008000' : '#FF0000'} />
                                    )}
                                </View>
                                <Text className="text-[#6C6060] text-[14px] font-kanit-light  mb-[1px]">Balance</Text>
                            </View>
                            <Text
                                className={`text-[18px] font-kanit ${Number(item?.newbalance) < 0 ? 'text-[#FF0000]' : 'text-[#008000]'
                                    }`}
                            >
                                {`₹${formatAmount(item?.newbalance)}/-`}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const openPicker = (mode: "from" | "to") => {
        setPickerMode(mode);
        setPickerVisible(true);
    };
    const handleDateConfirm = (date: Date) => {
        const today = new Date();

        if (date > today) {
            showAppToast(toast, "error", "Error", "Future dates are not allowed");
            setPickerVisible(false);
            return;
        }

        if (pickerMode === "from") {
            // 🚫 fromDate > toDate
            if (toDate && date > toDate) {
                showAppToast(toast, "error", "Error", "From date cannot be after To date");
                return;
            }
            setFromDate(date);
        } else {
            // 🚫 toDate < fromDate
            if (fromDate && date < fromDate) {
                showAppToast(toast, "error", "Error", "To date cannot be before From date");
                return;
            }
            setToDate(date);
        }

        setPickerVisible(false);
    };

    const applyFilter = async () => {
        try {

            if (!fromDate || !toDate) {
                showAppToast(toast, "error", "Error", "Please select date range");
                return;
            }

            if (fromDate > toDate) {
                showAppToast(toast, "error", "Error", "Invalid date range");
                return;
            }

            const payload = {
                user_id: id,
                fromdate: formatToYYYYMMDD(fromDate),
                todate: formatToYYYYMMDD(toDate),
            };
            try {
                const response = await downloadStatement(payload);
                setDownloadData(response || {})
                createPDF(response);
            } catch (error: any) {
                console.log('error-->', error?.response?.data)
            }
        } catch (error: any) {
            console.log('error while apply filter', error)
        } finally {
            setModalVisible(false)
        }
    };

    const generateHTML = (data: any) => {
        const rows = (data?.data || [])
            .map((item: any) => {
                let desc = "";
                try {
                    const parsed = item.description ? JSON.parse(item.description) : {};
                    desc = Object.entries(parsed)
                        .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
                        .join("<br/>");
                } catch {
                    desc = item.description || "-";
                }

                return `
        <tr>
          <td>${item.ledgerdate}</td>
          <td>
            <div class="desc">${item.amount_type}</div>
            <div class="sub">${desc}</div>
          </td>
          <td>
            <span class="badge ${item.type}">
              ${item.type.toUpperCase()}
            </span>
          </td>
          <td class="${item.type}">
            ₹${formatAmount(item?.amount)}/-
          </td>
          <td class="balance ${item.newbalance < 0 ? 'debit' : 'credit'}">
            ₹${formatAmount(item?.newbalance)}/-
          </td>
        </tr>
      `;
            })
            .join("");

        return `
  <html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        padding: 20px;
        background: #f6f8fb;
        color: #1a1a1a;
      }

      .credit { color: #16a34a; } /* green */
      .debit { color: #dc2626; } /* red */

      /* HEADER */
      .header {
        background: linear-gradient(135deg, #6a5acd, #8a7fff);
        color: white;
        padding: 20px;
        border-radius: 16px;
        margin-bottom: 20px;
      }

      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .title {
  font-size: 20px;
  font-weight: bold;
}

.date {
  font-size: 12px;
  opacity: 0.9;
}

/* DIVIDER */
.divider {
  height: 1px;
  background: rgba(255,255,255,0.3);
  margin: 12px 0;
}

.info-grid {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.info-box {
  flex: 1;
}

/* LABEL + VALUE */
.label {
  font-size: 11px;
  opacity: 0.8;
}

.value {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}


      .header p {
        margin: 5px 0 0;
        font-size: 13px;
        opacity: 0.9;
      }

      /* USER CARD */
      .card {
        background: white;
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }

      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 13px;
      }

      /* SUMMARY */
      .summary {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 20px;
      }

      .summary-box {
        flex: 1;
        background: white;
        border-radius: 12px;
        padding: 10px;
        text-align: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }

      .summary-box h4 {
        margin: 0;
        font-size: 12px;
        color: #666;
      }

      .summary-box p {
        margin: 5px 0 0;
        font-size: 16px;
        font-weight: bold;
      }

      .credit { color: #16a34a; }
      .debit { color: #dc2626; }

      /* TABLE */
      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }

      th {
        background: #f1f5f9;
        font-size: 12px;
        padding: 10px;
        text-align: left;
      }

      td {
        padding: 10px;
        font-size: 12px;
        border-top: 1px solid #eee;
        vertical-align: middle;
      }

      .desc {
        font-weight: 600;
      }

      .sub {
        font-size: 11px;
        color: #666;
      }

      /* BADGES */
      .badge {
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: bold;
      }

      .badge.credit {
        background: #dcfce7;
        color: #16a34a;
      }

      .badge.debit {
        background: #fee2e2;
        color: #dc2626;
      }

      .balance {
        font-weight: bold;
      }

      /* FOOTER */
      .footer {
        margin-top: 20px;
        font-size: 11px;
        text-align: center;
        color: #666;
      }

    </style>
  </head>

  <body>

    <!-- HEADER -->
    <!-- HEADER -->
    <div class="header">
    <div class="header-top">
        <div class="title">Ledger Statement</div>
        <div class="date">${data?.from_date} → ${data?.to_date}</div>
    </div>

    <div class="divider"></div>

    <div class="info-grid">
        <div class="info-box">
        <div class="label">Advisor Name</div>
        <div class="value">${data?.userdata?.user_name || '-'}</div>

        <div class="label">Mobile</div>
        <div class="value">${data?.userdata?.user_mobile || '-'}</div>

        <div class="label">Email</div>
        <div class="value">${data?.userdata?.user_email || '-'}</div>
        </div>

        <div class="info-box">
        <div class="label">Agent Name</div>
        <div class="value">${data?.agentdata?.agent_name || '-'}</div>

        <div class="label">Mobile</div>
        <div class="value">${data?.agentdata?.agent_mobile || '-'}</div>

        <div class="label">Email</div>
        <div class="value">${data?.agentdata?.agent_email || '-'}</div>
        </div>
    </div>
    </div>


    <!-- SUMMARY -->
    <div class="summary">
      <div class="summary-box">
        <h4>Opening</h4>
        <p class="credit">
        ₹${formatAmount(data?.opening_bal)}/-
        </p>
      </div>
      <div class="summary-box">
        <h4>Credit</h4>
        <p class="credit">
        ₹${formatAmount(data?.totalcredit)}/-
        </p>
      </div>
      <div class="summary-box">
        <h4>Debit</h4>
        <p class="debit">
        ₹${formatAmount(data?.totaldebit)}/-
        </p>
      </div>
      <div class="summary-box">
        <h4>Closing</h4>
        <p class="${data?.closing_bal < 0 ? 'debit' : 'credit'}">
        ₹${formatAmount(data?.closing_bal)}/-
        </p>
      </div>
    </div>

    <!-- TABLE -->
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Details</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <!-- FOOTER -->
    <div class="footer">
      Powered by BimaGrow Insurance Software
    </div>

  </body>
  </html>
  `;
    };

    const downloadPDF = async (results: any, data: any) => {
        try {
            const cleanName = (`${data?.agentdata?.agent_name}'s Statement` || "Ledger Statement");
            const fileName = `${cleanName}.pdf`;
            const res = await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
                {
                    name: fileName,
                    parentFolder: "",
                    mimeType: "application/pdf",
                },
                "Download",
                results.filePath
            );

            showAppToast(toast, "success", "Downloaded", "Saved to Downloads!");

            setTimeout(() => {
                ReactNativeBlobUtil.android.actionViewIntent(
                    res,
                    "application/pdf"
                );
            }, 800);

        } catch (error) {
            console.log("Download error:", error);
            showAppToast(toast, "error", "Error", "Download failed");
        }
    };

    const createPDF = async (data: any) => {
        const html = generateHTML(data);

        let options = {
            html,
            fileName: 'Ledger_Statement',
            base64: true,
        };

        let results = await generatePDF(options);
        await downloadPDF(results, data);
    };
    return (
        <View className="flex-1 py-[20px]">
            {
                loading ? (
                    <View>
                        {[...Array(5)].map((_, i) => (
                            <SkeletonItem key={i} />
                        ))}
                    </View>
                ) : (
                    <FlatList
                        data={statement}
                        keyExtractor={(item, index) =>
                            item.id?.toString() || index.toString()
                        }
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: statement.length === 0 ? "center" : "flex-start",
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        ListHeaderComponent={
                            <View className="items-end mb-3">
                                <TouchableOpacity
                                    className="h-[30px] bg-[#B4A5DC] border px-2 flex-row items-center justify-center gap-1 rounded-[16px]"
                                    // onPress={() => router.push({ pathname: '/ledger-detail', params: { id: item?.id }, })}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <DownloadSimpleIcon size={16} weight="bold" />
                                    <Text className="text-black text-[12px] font-kanit-medium">Download Statement</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center">
                                <Image source={require('@/assets/images/empty.png')} className="w-[293px] h-[180px]" resizeMode="contain" />
                                <Text className="text-gray-400 text-[15px] font-kanit">
                                    No statement found
                                </Text>
                            </View>
                        }
                        ListFooterComponent={
                            <View className="my-[10px]">
                                {hasMore && (
                                    <View className="items-center">
                                        <TouchableOpacity
                                            onPress={handleLoadMore}
                                            className="bg-[#B4A5DC] flex-row gap-2 h-[40px] w-1/3 justify-center items-center rounded-full"
                                        >
                                            {loadingMore && (
                                                <ActivityIndicator size="small" color="#000" />
                                            )}
                                            <Text className="text-black font-semibold">
                                                {loadingMore ? "Loading..." : "Load More"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {!hasMore && statement.length > 0 && (
                                    <Text className="text-center text-gray-500 mt-4">
                                        No more statement
                                    </Text>
                                )}
                            </View>
                        }
                    />
                )
            }
            <Modal
                isOpen={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                }}
                size="md"
            >
                <ModalBackdrop />
                <ModalContent className="bg-[#1C1C1C] rounded-[12px] border-0">
                    <ModalHeader>
                        <Text className="text-white text-[18px] font-biorhyme mb-3">Select Date Range</Text>
                        <ModalCloseButton>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <TouchableOpacity
                            onPress={() => openPicker("from")}
                            className="p-4 border border-[#fff] rounded-[12px] mb-3"
                        >
                            <Text className="text-white font-kanit-light">{fromDate ? formatDate(fromDate) : "Select From Date"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openPicker("to")}
                            className="p-4 border border-[#fff] rounded-[12px] mb-3"
                        >
                            <Text className="text-white font-kanit-light">{toDate ? formatDate(toDate) : "Select To Date"}</Text>
                        </TouchableOpacity>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            action="secondary"
                            className="mr-2 border-[#fff] rounded-[8px]"
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            <ButtonText className="font-kanit">Cancel</ButtonText>
                        </Button>
                        <Button
                            className="bg-[#DEF3A1] rounded-[8px]"
                            onPress={() =>
                                applyFilter()
                            }
                        >
                            <ButtonText className="text-black font-kanit">Apply</ButtonText>
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
            <DateTimePickerModal
                isVisible={pickerVisible}
                mode="date"
                minimumDate={pickerMode === "to" && fromDate ? fromDate : undefined}
                maximumDate={
                    pickerMode === "from" && toDate
                        ? toDate
                        : new Date()
                }
                onConfirm={handleDateConfirm}
                onCancel={() => setPickerVisible(false)}
            />
        </View>
    );
}