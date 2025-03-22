"use client";

// React
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLayout } from "@/app/LayoutContext";
import { useRouter } from "next/navigation";

// API Services
import {
  UserWorkflow,
  findUserWorkflowsByUser,
  deleteUserWorkflow,
} from "@/api/services/workflow_manager_service";

// API Error
import { findHandleError } from "@/app/utils/api_errors/findHandleError";

// Table Components
import Table, {
  ColumnDefinition,
  SortOrder,
} from "@/app/components/table/Table";
import BasicTableActions from "@/app/components/table/BasicTableActions";
import FabAdd from "@/app/components/buttons/FabAdd";
import GridStatus from "@/app/components/table/grid/GridStatus";

// Header Components
import TextInputSearch from "@/app/components/inputs/normal/TextInputSearch";
import SelectMultipleEnumSearch from "@/app/components/inputs/normal/SelectMultipleEnumSearch";
import {
  getEnumValues_,
} from "@/app/components/inputs/input_types";
import ButtonSubmit from "@/app/components/buttons/ButtonSubmit";
import ButtonReset from "@/app/components/buttons/ButtonReset";
import ButtonDownload from "@/app/components/buttons/ButtonDownload";
import { downloadPDF, downloadExcel } from "@/app/utils/download/downloadUtils";

// Enums
import { WorkflowStatus, } from "@/api/Enums";

// Language
import { useTranslation } from "@/app/utils/language/i18n";

//Auth
import AuthUtil from '@/app/utils/auth/AuthUtil';

// Table Columns
const getTranslatedColumns = (
  t: (key: string) => string
): ColumnDefinition<UserWorkflow>[] => [
    {
      name: "Workflow Name",
      l_name: t("p_workflow.workflow_name"),
      key: "workflow_name",
      type: "Simple",
    },
    {
      name: "Workflow Description",
      l_name: t("p_workflow.workflow_description"),
      key: "workflow_description",
      type: "Simple",
    },
    {
      name: "Workflow Status",
      l_name: t("p_workflow.workflow_status"),
      key: "workflow_status",
      type: "Custom",
      accessor: (row: UserWorkflow) => <GridStatus status={row.workflow_status} />,
    },
    {
      name: "Nodes Count",
      l_name: t("p_workflow.nodes_count"),
      key: "nodes_count",
      type: "Simple",
    },
    {
      name: "Edges Count",
      l_name: t("p_workflow.edges_count"),
      key: "edges_count",
      type: "Simple",
    },
    {
      name: "Added Date Time",
      l_name: t("table.added_date_time"),
      key: "added_date_time",
      type: "Simple",
    },
    {
      name: "Modified Date Time",
      l_name: t("table.modified_date_time"),
      key: "modified_date_time",
      type: "Simple",
    },
  ];

const WorkflowListPage: React.FC = () => {
  const { setLoading } = useLayout();

  const { t } = useTranslation();

  const page_name = t("p_workflow.workflow_manager");

  const COLUMNS = useMemo(() => getTranslatedColumns(t), [t]);

  // Header
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch((prev) =>
        search.trim() === prev ? prev : search.trim()
      );
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const [selectedStatuses, setSelectedStatuses] = useState<WorkflowStatus[]>(
    getEnumValues_(WorkflowStatus)
  );

  // Header Button Actions
  const downloadPDFHandler = () => {
    downloadPDF(workflow_list, COLUMNS, page_name);
  };
  const downloadExcelHandler = () => {
    downloadExcel(workflow_list, COLUMNS, page_name);
  };

  const router = useRouter();
  const openCreateWorkflow = useCallback(() => {
    router.push("/workflow/create");
  }, [router]);

  const openEditWorkflow = useCallback((row: UserWorkflow) => {
    router.push(`/workflow/edit?id=${row.workflow_id}`);
  }, [router]);

  // Table sort
  const [sortOrder, setSortOrder] = useState<SortOrder[]>([]);

  // Table Data
  const [workflow_list, set_workflow_list] = useState<UserWorkflow[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch Data
  const fetch_workflow_list = useCallback(async () => {
    try {
      setLoading(true);
      setTableLoading(true);
      const queryParams = {
        search: debouncedSearch.trim(),
        status: selectedStatuses.join(','),
      };
      const response = await findUserWorkflowsByUser("" + AuthUtil.getUserId(), queryParams);
      if (response.status) {
        set_workflow_list(response.data || []);
      } else {
        set_workflow_list([]);
      }
    } catch (error) {
      findHandleError(error);
      set_workflow_list([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  }, [setLoading, debouncedSearch, selectedStatuses]);

  // Table Actions
  const TABLE_ACTIONS = useCallback(
    (row: UserWorkflow) => (
      <BasicTableActions
        rowId={String(row.workflow_id)}
        onEdit={() => openEditWorkflow(row)}
        onDelete={deleteUserWorkflow}
        title={page_name}
        onSuccess={fetch_workflow_list}
      />
    ),
    [fetch_workflow_list, openEditWorkflow, page_name]
  );

  // Initial Fetch
  useEffect(() => {
    fetch_workflow_list();
  }, [fetch_workflow_list]);

  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 px-4 py-2 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-grow">

          <div className="w-[250px]">
            <TextInputSearch
              label={t("forms.search_title")}
              placeholder={t("forms.search_placeholder")}
              value={search}
              onChange={setSearch}
            />
          </div>

          <div className="w-[250px]">
            <SelectMultipleEnumSearch
              label={t("forms.statuses")}
              placeholder={`${t("forms.select")} ${t("forms.statuses")}`}
              enumType={WorkflowStatus}
              value={selectedStatuses}
              onChange={(values) => setSelectedStatuses(values as WorkflowStatus[])}
            />
          </div>

        </div>

        <div className="flex flex-wrap items-center justify-start w-full md:w-auto gap-4">
          <ButtonSubmit onClick={fetch_workflow_list} />
          <ButtonReset onClick={() => setSearch("")} />
          <ButtonDownload
            onDownloadPDF={downloadPDFHandler}
            onDownloadExcel={downloadExcelHandler}
          />
        </div>

      </header>

      {/* Table */}
      <div className="flex-1 overflow-auto mx-2 mb-2">
        <Table
          columns={COLUMNS}
          data={workflow_list}
          actions={TABLE_ACTIONS}
          showIndexColumn
          loading={tableLoading}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </div>

      {/* Fab Add */}
      <FabAdd name={page_name} action={openCreateWorkflow} />
    </div>
  );
};

export default WorkflowListPage;
